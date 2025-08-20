import { HttpContext } from '@adonisjs/core/http'
import BankAccount from '#models/bank_account'
import Balance from '#models/balance'
import AccountsService from '#services/accounts_service'
import { inject } from '@adonisjs/core'

@inject()
export default class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}
  async create({ auth, request, response }: HttpContext) {
    const data = request.all()
    const account = {
      userId: auth?.user?.id,
      name: data.accountName,
      description: data.accountDescription,
    }
    const bankAccount = await BankAccount.create(account)

    const balance = {
      bankAccountId: bankAccount.id,
      amount: data.initialBalance,
    }
    await Balance.create(balance)

    const bankAccounts = await this.accountsService.GetAllAccountsForUser(auth?.user?.id || 0)
    return response.json(bankAccounts)
  }

  async delete({ auth, params, response }: HttpContext) {
    try {
      const account = await BankAccount.findOrFail(params.id)
      await account.delete()

      const bankAccounts = await this.accountsService.GetAllAccountsForUser(auth?.user?.id || 0)

      response.json(bankAccounts)
    } catch (error) {
      response.internalServerError(error.message)
    }
  }
}
