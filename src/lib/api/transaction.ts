import { query, insert } from './supabase/database';
import { Transaction } from '@/lib/types';
import { generateUUID, getCurrentTimestamp } from '@/lib/utils';

export const createTransaction = async (transactionData: Partial<Transaction>): Promise<Transaction> => {
  const newTransaction: Partial<Transaction> = {
    ...transactionData,
    transaction_id: generateUUID(),
    created: getCurrentTimestamp()
  };
  return await insert<Transaction>('TRANSACTION', newTransaction);
};

export const getTransactionsByPlayerId = async (playerId: string): Promise<Transaction[]> => {
  return await query<Transaction>('TRANSACTION', {
    select: `
      *,
      by:by_id(first_name, last_name),
      for:for_id(first_name, last_name)
    `,
    eq: ['by_id', playerId]
  });
};