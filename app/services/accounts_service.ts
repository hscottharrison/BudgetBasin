import BankAccount, { BankAccountDTO } from '#models/bank_account'

export default class AccountsService {
  async GetAllAccountsForUser(userId: number): Promise<BankAccountDTO[]> {
    const userAccounts = await BankAccount.query()
      .preload('balances')
      .join('balances', 'balances.bank_account_id', 'bank_accounts.id')
      .select('bank_accounts.*')
      .where('user_id', userId ?? 0)

    return userAccounts.map((a) => {
      const json = a.serialize()
      return {
        id: json.id,
        name: json.name,
        balances: json.balances ? json.balances : [],
        updatedAt: a.updatedAt.toISO() ?? null,
      }
    })
  }
}
