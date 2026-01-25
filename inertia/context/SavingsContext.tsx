import React, {createContext, useContext, useMemo, useState, ReactNode, useEffect} from "react";
import { BankAccountDTO } from "#models/bank_account";
import { BucketDTO } from "#models/bucket";
import { TransactionDTO } from "#models/transaction";
import { BalanceDTO } from "#models/balance";
import { calculateTotalAccountsBalance, sumTransactions} from "~/services/utils_service";
import {TransactionTypeDTO} from "#models/transaction_type";

// Define the context value type
export interface SavingsContextProps {
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
const SavingsContext = createContext<SavingsContextProps | undefined>(undefined);

// Create the Provider component
export const SavingsProvider: React.FC<{
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
    return calculateTotalAccountsBalance(accounts)
  }, [accounts]);

  /**
   * CONTEXT OPERATIONS
   */
  const updateAccounts = (newAccounts: BankAccountDTO[]) => setAccounts(newAccounts);

  const updateAccountBalance = (balance: BalanceDTO) => {
    setAccounts((prevAccounts) =>
      prevAccounts.map((acc) =>
        acc.id === balance.bankAccountId
          ? { ...acc, balances: [...acc.balances, balance] }
          : acc
      )
    );
  };

  const addBucket = (bucket: BucketDTO) => setBuckets([...buckets, bucket]);

  const updateBuckets = (newBuckets: BucketDTO[]) => setBuckets(newBuckets);

  const updateTransactionsForBucket = (allocation: TransactionDTO) => {
    setBuckets((prevBuckets) =>
      prevBuckets.map((bucket) =>
        bucket.id === allocation.bucketId
          ? { ...bucket, transactions: [...bucket.transactions, allocation] }
          : bucket
      )
    );
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

  return <SavingsContext.Provider value={value}>{children}</SavingsContext.Provider>;
};

// Use this hook to access the context
export const useSavings = (): SavingsContextProps => {
  const context = useContext(SavingsContext);
  if (!context) {
    throw new Error("useSavings must be used within a SavingsProvider");
  }
  return context;
};
