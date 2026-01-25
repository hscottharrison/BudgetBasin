import { BankAccountDTO } from '#models/bank_account'
import { createContext, ReactNode, useContext, useMemo } from 'react'
import {
  calculateTotalAccountsBalance,
  getTotalExpenseCategoryFromBudget,
} from '~/services/utils_service'
import { BudgetPeriodDTO } from '#models/budget_period'
import { BudgetCategoryDTO } from '#models/budget_category'

export interface UserHomeContextProps {
  currentPeriod: BudgetPeriodDTO
  totalSavings: number
  totalChecking: number
  totalActualExpenses: number
  userAccounts: BankAccountDTO[]
}

const UserHomeContext = createContext<UserHomeContextProps | null>(null)

export const UserHomeProvider: React.FC<({
  userAccounts: BankAccountDTO[],
  currentPeriod: BudgetPeriodDTO,
  categories: BudgetCategoryDTO[],
  children: ReactNode
})> = ({ userAccounts, categories, children, currentPeriod }) => {

  const totalSavings = useMemo(() => {
    const savingsAccounts = userAccounts
      .filter((account) => account.accountType === 'savings')
    return calculateTotalAccountsBalance(savingsAccounts)
  }, [userAccounts])

  const totalChecking = useMemo(() => {
    const checkingAccounts = userAccounts
      .filter((account) => account.accountType === 'checking')
    return calculateTotalAccountsBalance(checkingAccounts)
  }, [userAccounts])

  const totalActualExpenses = useMemo(() => {
    if (!currentPeriod) return 0
    return getTotalExpenseCategoryFromBudget(currentPeriod, categories, 'expense')
  }, [currentPeriod, categories])

  const value = {
    currentPeriod,
    userAccounts,
    totalSavings,
    totalChecking,
    totalActualExpenses,
  }

  return <UserHomeContext.Provider value={value}>{children}</UserHomeContext.Provider>
}

export const useUserHome = (): UserHomeContextProps => {
  const context = useContext(UserHomeContext)
  if(!context) {
    throw new Error('useUserHome must be used within a UserHomeProvider')
  }
  return context;
}
