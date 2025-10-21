import { BalanceDTO } from '#models/balance'
import { TransactionDTO } from '#models/transaction'

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
