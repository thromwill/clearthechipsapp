
interface Balance {
  [key: string]: number;
}

interface Transaction {
  by: string;
  for: string;
  amount: number;
}

// Assumes balances sum to zero
export function calculateTransactions(balances: Balance): Transaction[] {
  const payments: Transaction[] = [];

  if (checkBalances(balances)) {
    let workingBalances = { ...balances };
    workingBalances = Object.fromEntries(
      Object.entries(workingBalances).filter(([_, value]) => value !== 0)
    );

    while (Object.keys(workingBalances).length > 0) {
      const creditorEntry = Object.entries(workingBalances).reduce((max, entry) => 
        entry[1] > 0 && entry[1] > max[1] ? entry : max
      );
      const debtorEntry = Object.entries(workingBalances).reduce((min, entry) => 
        entry[1] < 0 && entry[1] < min[1] ? entry : min
      );

      const tx: Transaction = {
        by: debtorEntry[0],
        for: creditorEntry[0],
        amount: Math.min(creditorEntry[1], -debtorEntry[1])
      };
      payments.push(tx);
      processTx(workingBalances, tx);

      if (workingBalances[tx.by] === 0) delete workingBalances[tx.by];
      if (workingBalances[tx.for] === 0) delete workingBalances[tx.for];

      console.log(`#${payments.length}: tx=${JSON.stringify(tx)} balances=${JSON.stringify(workingBalances)}`);
      console.assert(Math.abs(Object.values(workingBalances).reduce((sum, val) => sum + val, 0)) <= 1e-9);
    }

    console.log(JSON.stringify(payments));
  }

  return payments;
}

function checkBalances(balances: Balance): boolean {
  return (
    typeof balances === 'object' &&
    Object.keys(balances).length > 0 &&
    !Object.values(balances).every(balance => balance === 0) &&
    Math.abs(Object.values(balances).reduce((sum, val) => sum + val, 0)) <= 1e-9
  );
}

function processTx(balances: Balance, tx: Transaction): void {
    balances[tx.by] += tx.amount;
    balances[tx.for] -= tx.amount;
}

// function adjustBalances(balances: Balance): Balance {
//   const totalBalance = Object.values(balances).reduce((sum, val) => sum + val, 0);
//   return Object.fromEntries(
//     Object.entries(balances).map(([player, balance]) => [
//       player,
//       balance + (balance / totalBalance) * Math.abs(totalBalance)
//     ])
//   );
// }

// // New functions to handle errors and provide options

// // Function to handle balances that don't sum to zero
// function handleUnbalancedTotals(balances: Balance): Balance | null {
//   const totalBalance = Object.values(balances).reduce((sum, val) => sum + val, 0);
//   if (Math.abs(totalBalance) > 1e-9) {
//     console.log(`Balances don't sum to zero. Total balance: ${totalBalance}`);
//     // Implement user interaction here
//     // For now, we'll just return null
//     return null;
//   }
//   return balances;
// }

// // Function to allow host to fix balances manually
// function hostFixBalances(balances: Balance): Balance {
//   // This function would involve user interaction
//   // For demonstration, we'll just log the current balances
//   console.log("Current balances:", balances);
//   // In a real implementation, you'd allow the host to adjust values
//   return balances;
// }

// // Function to adjust balances proportionally
// function adjustBalancesProportionally(balances: Balance): Balance {
//   const totalPositive = Object.values(balances).reduce((sum, val) => val > 0 ? sum + val : sum, 0);
//   const totalNegative = Object.values(balances).reduce((sum, val) => val < 0 ? sum + val : sum, 0);
//   const adjustmentFactor = totalPositive / Math.abs(totalNegative);

//   return Object.fromEntries(
//     Object.entries(balances).map(([player, balance]) => [
//       player,
//       balance > 0 ? balance : balance * adjustmentFactor
//     ])
//   );
// }

// // Main function to handle balance errors
// function handleBalanceErrors(balances: Balance): Balance | null {
//   if (!checkBalances(balances)) {
//     console.log("Balances are not valid. Attempting to resolve...");
    
//     // Option 1: Host fixes balances
//     // balances = hostFixBalances(balances);
    
//     // Option 2: Adjust balances proportionally
//     // balances = adjustBalancesProportionally(balances);
    
//     // Option 3: Implement additional error handling method here
    
//     // Check if balances are now valid
//     if (!checkBalances(balances)) {
//       console.log("Unable to resolve balance errors. Please check the input data.");
//       return null;
//     }
//   }
//   return balances;
// }

// // Usage example
// const balances: Balance = { Alice: 100, Bob: -50, Charlie: -50 };
// const validBalances = handleBalanceErrors(balances);
// if (validBalances) {
//   const transactions = calculateTransactions(validBalances);
//   console.log("Final transactions:", transactions);
// } else {
//   console.log("Failed to calculate transactions due to balance errors.");
// }