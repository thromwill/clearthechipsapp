import { RateLimiter } from 'limiter';
import Queue from 'better-queue';
import retry from 'retry';
import { z } from 'zod';
import crypto from 'crypto';

// Schema validation
const BalanceSchema = z.record(z.string(), z.number());
const TransactionSchemaType = z.object({
  by: z.string(),
  for: z.string(),
  amount: z.number().positive(),
});
const VenmoApiResponseSchema = z.object({
  data: z.object({
    payment: z.object({
      id: z.string(),
      status: z.string(),
    }),
  }),
});

type Balance = z.infer<typeof BalanceSchema>;
type Transaction = z.infer<typeof TransactionSchemaType>;
type VenmoApiResponse = z.infer<typeof VenmoApiResponseSchema>;

// Configuration
const config = {
  venmo: {
    baseUrl: process.env.VENMO_API_URL || 'https://api.venmo.com/v1',
    rateLimit: {
      tokensPerInterval: Number(process.env.VENMO_RATE_LIMIT_TOKENS) || 100,
      interval: (process.env.VENMO_RATE_LIMIT_INTERVAL || 'hour') as 'hour' | 'minute' | 'second',
    },
    retries: {
      attempts: Number(process.env.VENMO_RETRY_ATTEMPTS) || 3,
      factor: Number(process.env.VENMO_RETRY_FACTOR) || 2,
      minTimeout: Number(process.env.VENMO_RETRY_MIN_TIMEOUT) || 1000,
      maxTimeout: Number(process.env.VENMO_RETRY_MAX_TIMEOUT) || 60000,
    },
    concurrent: Number(process.env.VENMO_CONCURRENT_REQUESTS) || 5,
  },
  encryption: {
    algorithm: 'aes-256-gcm' as const,
    key: process.env.ENCRYPTION_KEY || 'default-key-32-chars-exactly!!!!!',
    ivLength: 16,
  },
};

// Rate limiter instance
const venmoApiLimiter = new RateLimiter({
  tokensPerInterval: config.venmo.rateLimit.tokensPerInterval,
  interval: config.venmo.rateLimit.interval,
  fireImmediately: true,
});

// Encryption utilities
const encryption = {
  encrypt: (text: string, key: string): string => {
    const iv = crypto.randomBytes(config.encryption.ivLength);
    const cipher = crypto.createCipheriv(
      config.encryption.algorithm,
      Buffer.from(key),
      iv
    ) as crypto.CipherGCM;
    
    const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
    const authTag = cipher.getAuthTag();
    return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted.toString('hex')}`;
  },

  decrypt: (text: string, key: string): string => {
    const [ivHex, authTagHex, encryptedHex] = text.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');
    const encrypted = Buffer.from(encryptedHex, 'hex');
    const decipher = crypto.createDecipheriv(
      config.encryption.algorithm,
      Buffer.from(key),
      iv
    ) as crypto.DecipherGCM;
    
    decipher.setAuthTag(authTag);
    return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString();
  },
};

// Calculate optimal transactions
function calculateTransactions(balances: Balance): Transaction[] {
  const transactions: Transaction[] = [];
  const players = Object.keys(balances);
  const workingBalances = { ...balances };
  
  players.forEach((debtor) => {
    if (workingBalances[debtor] < 0) {
      players.forEach((creditor) => {
        if (workingBalances[creditor] > 0) {
          const amount = Math.min(Math.abs(workingBalances[debtor]), workingBalances[creditor]);
          if (amount > 0) {
            transactions.push({
              by: debtor,
              for: creditor,
              amount: amount,
            });
            workingBalances[debtor] += amount;
            workingBalances[creditor] -= amount;
          }
        }
      });
    }
  });

  return transactions;
}

async function createVenmoPaymentRequest(
  byUserId: string,
  forUserId: string,
  amount: number,
  note: string
): Promise<VenmoApiResponse> {
  try {
    // Get Venmo credentials
    const [forVenmoId, encryptedAuthToken] = await Promise.all([
      getVenmoIdForUser(forUserId),
      getVenmoAuthToken(byUserId),
    ]);
    
    const authToken = encryption.decrypt(encryptedAuthToken, config.encryption.key);

    const remainingRequests = await venmoApiLimiter.removeTokens(1);
    if (remainingRequests < 0) {
      throw new Error('Rate limit exceeded');
    }

    const response = await fetch(`${config.venmo.baseUrl}/payments`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: forVenmoId,
        amount: -Math.floor(amount), // Ensure whole dollar amounts
        note: note,
      }),
    });

    if (!response.ok) {
      throw new Error(`Venmo API request failed: ${response.statusText}`);
    }

    const result = await response.json();
    return VenmoApiResponseSchema.parse(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(`Invalid API response: ${error.message}`);
    }
    throw error;
  }
}

function processTransaction(transaction: Transaction): Promise<VenmoApiResponse> {
  return new Promise((resolve, reject) => {
    const operation = retry.operation(config.venmo.retries);

    operation.attempt(async (currentAttempt) => {
      try {
        const result = await createVenmoPaymentRequest(
          transaction.by,
          transaction.for,
          transaction.amount,
          'Game settlement payment'
        );
        console.log(
          `Created Venmo request: ${transaction.by} -> ${transaction.for} for $${transaction.amount}`
        );
        resolve(result);
      } catch (error) {
        if (operation.retry(error as Error)) {
          console.log(`Retrying transaction (attempt ${currentAttempt})`);
          return;
        }
        console.error(
          `Failed to create Venmo request after ${currentAttempt} attempts:`,
          error
        );
        reject(error);
      }
    });
  });
}

const transactionQueue = new Queue(processTransaction, {
  concurrent: config.venmo.concurrent,
});

export async function createVenmoTransactions(balances: Balance): Promise<void> {
  try {
    const validatedBalances = BalanceSchema.parse(balances);
    const transactions = calculateTransactions(validatedBalances);

    if (transactions.length === 0) {
      console.log('No transactions needed');
      return;
    }

    const queuePromises = transactions.map(
      (tx) =>
        new Promise((resolve, reject) => {
          transactionQueue.push(tx, (err, result) => {
            if (err) reject(err);
            else resolve(result);
          });
        })
    );

    await Promise.all(queuePromises);
    console.log('All transactions processed successfully');
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(`Invalid balance data: ${error.message}`);
    }
    throw error;
  }
}

// These functions need to be implemented based on your authentication system
async function getVenmoIdForUser(userId: string): Promise<string> {
  // Implement your user -> Venmo ID lookup logic
  throw new Error('Not implemented');
}

async function getVenmoAuthToken(userId: string): Promise<string> {
  // Implement your Venmo auth token retrieval logic
  throw new Error('Not implemented');
}

export type { Balance, Transaction, VenmoApiResponse };