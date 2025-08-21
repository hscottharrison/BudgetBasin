import { BalanceDTO } from '#models/balance'
import { AllocationDTO } from '#models/allocation'

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

export function sumAllocations(allocations: AllocationDTO[]): number {
  return allocations.reduce((acc: number, allocation: AllocationDTO) => {
    return (acc += allocation.amount)
  }, 0)
}
