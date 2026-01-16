import BankAccount, { BankAccountDTO } from '#models/bank_account'

export default class AccountsService {
  async GetAllAccountsForUser(userId: number): Promise<BankAccountDTO[]> {
    const userAccounts = await BankAccount.query()
      .preload('balances')
      .select('bank_accounts.*')
      .where('user_id', userId ?? 0)

    return userAccounts.map((a) => {
      const json = a.serialize()
      return {
        id: json.id,
        name: json.name,
        accountType: json.accountType,
        balances: json.balances ? json.balances : [],
        createdAt: a.createdAt.toISO() ?? null,
      }
    })
  }

  async GetSavingsAccountsForUser(userId: number): Promise<BankAccountDTO[]> {
    const savingsAccounts = await BankAccount.query()
      .where('user_id', userId)
      .where('account_type', 'savings')
      .preload('balances')
      .select('bank_accounts.*')

    return savingsAccounts.map((a) => {
      const json = a.serialize()
      return {
        id: json.id,
        name: json.name,
        accountType: json.accountType,
        balances: json.balances ? json.balances : [],
        createdAt: a.createdAt.toISO() ?? null,
      }
    })
  }
}
