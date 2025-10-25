import React, {createContext, useContext, useMemo, useState, ReactNode, useEffect} from "react";
import { BankAccountDTO } from "#models/bank_account";
import { BucketDTO } from "#models/bucket";
import { TransactionDTO } from "#models/transaction";
import { BalanceDTO } from "#models/balance";
import {sumTransactions} from "~/services/utils_service";
import {TransactionTypeDTO} from "#models/transaction_type";

// Define the context value type
export interface UserHomeContextProps {
  accounts: BankAccountDTO[];
  buckets: BucketDTO[];
  bucketBreakdown: { name: string; value: number }[];
  totalAllocations: number;
  totalBalance: number;
  transactionTypes: TransactionTypeDTO[];
  updateAccounts: (accounts: BankAccountDTO[]) => void;
  updateAccountBalance: (balance: BalanceDTO) => void;
  addBucket: (bucket: BucketDTO) => void;
  updateBuckets: (buckets: BucketDTO[]) => void;
  updateTransactionsForBucket: (allocation: TransactionDTO) => void;
}

// Create the context
const UserHomeContext = createContext<UserHomeContextProps | undefined>(undefined);

// Create the Provider component
export const UserHomeProvider: React.FC<{
  userBuckets: BucketDTO[];
  userAccounts: BankAccountDTO[];
  transactionTypes: TransactionTypeDTO[];
  children: ReactNode;
}> = ({ userBuckets, userAccounts, children, transactionTypes }) => {
  /**
   * STATE
   */
  const [accounts, setAccounts] = useState<BankAccountDTO[]>(userAccounts);
  const [buckets, setBuckets] = useState<BucketDTO[]>(userBuckets);
  const [bucketBreakdown, setBucketBreakdown] = useState<{ name: string; value: number }[]>([]);
  const [totalAllocations, setTotalAllocations] = useState<number>(0);

  /**
   * EFFECTS
   */
  useEffect(parseBucketData, [buckets])

  /**
   * MEMOS
   */
  const totalBalance = useMemo(() => {
    return accounts.reduce((acc: number, account: BankAccountDTO) => {
      const latestBalance = account.balances[account.balances.length - 1]?.amount;
      return latestBalance ? acc + latestBalance : acc;
    }, 0);
  }, [accounts]);

  /**
   * CONTEXT OPERATIONS
   */
  const updateAccounts = (newAccounts: BankAccountDTO[]) => setAccounts(newAccounts);

  const updateAccountBalance = (balance: BalanceDTO) => {
    const index = accounts.findIndex((acc) => acc.id === balance.bankAccountId);
    accounts[index]?.balances.push(balance);
    setAccounts([...accounts]);
  };

  const addBucket = (bucket: BucketDTO) => setBuckets([...buckets, bucket]);

  const updateBuckets = (newBuckets: BucketDTO[]) => setBuckets(newBuckets);

  const updateTransactionsForBucket = (allocation: TransactionDTO) => {
    const index = buckets.findIndex((bucket) => bucket.id === allocation.bucketId);
    const bucketToUpdate = buckets[index];
    buckets[index] = {
      ...bucketToUpdate,
      transactions: [...bucketToUpdate.transactions, allocation],
    };
    setBuckets([...buckets]);
  };

  //region EFFECT METHODS
  function parseBucketData(){
    const breakdownArr: {name: string, value: number}[] = []
    const amount = buckets.reduce((acc: number, bucket: BucketDTO) => {
      const sum = sumTransactions(bucket.transactions)
      breakdownArr.push({name: bucket.name, value: sum})
      return acc += sum
    }, 0)
    setTotalAllocations(amount)
    setBucketBreakdown(breakdownArr)
  }
  //endregion


  /**
   * PROVIDER VALUE
   */
  const value = {
    accounts,
    buckets,
    bucketBreakdown,
    totalAllocations,
    totalBalance,
    transactionTypes,
    updateAccounts,
    updateAccountBalance,
    addBucket,
    updateBuckets,
    updateTransactionsForBucket,
  };

  return <UserHomeContext.Provider value={value}>{children}</UserHomeContext.Provider>;
};

// Use this hook to access the context
export const useUserHome = (): UserHomeContextProps => {
  const context = useContext(UserHomeContext);
  if (!context) {
    throw new Error("useUserHome must be used within a UserHomeProvider");
  }
  return context;
};
