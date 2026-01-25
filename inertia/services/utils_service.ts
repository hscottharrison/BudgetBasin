import { BalanceDTO } from '#models/balance'
import { TransactionDTO } from '#models/transaction'
import { DateTime } from 'luxon'
import { BankAccountDTO } from '#models/bank_account'
import { BudgetPeriodDTO } from '#models/budget_period'
import { BudgetCategoryDTO } from '#models/budget_category'

export function getLatestBalance(balances: BalanceDTO[]): BalanceDTO | null {
  const validBalances = balances.filter((b) => b.createdAt !== null)
  if (validBalances.length === 0) return null

  const sortedBalances = validBalances.sort(
    (a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
  )
  return sortedBalances[0]
}

export function formatCurrency(amount: number): string {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  })
  return formatter.format(amount)
}

export function sumTransactions(allocations: TransactionDTO[]): number {
  return allocations.reduce((acc: number, allocation: TransactionDTO) => {
    switch (allocation.transactionType.value) {
      case 'allocation':
        return (acc += allocation.amount)
      case 'spend':
      case 'transfer':
        return (acc -= allocation.amount)
      default:
        return (acc += allocation.amount)
    }
  }, 0)
}

export function formatDate(date: string): string {
  return DateTime.fromISO(date).toFormat('MMM dd, yyyy')
}

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]
export function formatBudgetMonth(month: number, year: number) {
  return `${MONTH_NAMES[month - 1]} ${year}`
}

export function calculateTotalAccountsBalance(accounts: BankAccountDTO[]) {
  return accounts.reduce((acc: number, account: BankAccountDTO) => {
    const latestBalance = account.balances[account.balances.length - 1]?.amount;
    return latestBalance ? acc + latestBalance : acc;
  }, 0);
}

export function getTotalExpenseCategoryFromBudget(
  period: BudgetPeriodDTO,
  categories: BudgetCategoryDTO[],
  categoryType: 'expense' | 'income'
) {
  return period.entries
    .filter((entry) => {
      const cat = categories.find((c) => c.id === entry.budgetCategoryId)
      return cat?.type === categoryType
    })
    .reduce((sum, entry) => sum + entry.amount, 0)
}
