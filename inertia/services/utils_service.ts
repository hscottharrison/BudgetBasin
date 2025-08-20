import { BalanceDTO } from '#models/balance'

export function getLatestBalance(balances: BalanceDTO[]): BalanceDTO | null {
  const validBalances = balances.filter((b) => b.createdAt !== null)
  if (validBalances.length === 0) return null

  const sortedBalances = validBalances.sort(
    (a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
  )
  return sortedBalances[0]
}
