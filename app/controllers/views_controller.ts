import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import BankAccount from '#models/bank_account'
// import {UserHomeDTO} from "#models/user_home_dto";

@inject()
export default class ViewsController {
  async home({ inertia }: HttpContext) {
    return inertia.render('home')
  }

  async login({ inertia }: HttpContext) {
    return inertia.render('Login/login')
  }

  async register({ inertia }: HttpContext) {
    return inertia.render('Register/register')
  }

  async userHome({ inertia, auth }: HttpContext) {
    const userAccounts = await BankAccount.query()
      .preload('balances')
      .join('balances', 'balances.bank_account_id', 'bank_accounts.id')
      .select('bank_accounts.*')
      .where('user_id', auth?.user?.id ?? 0)

    const dto = {
      user: {
        firstName: auth?.user?.firstName || '',
        lastName: auth?.user?.lastName || '',
      },
      userAccounts: userAccounts.map((a) => {
        const json = a.serialize()
        return {
          id: json.id,
          name: json.name,
          balances: json.balances ? json.balances : [],
          updatedAt: a.updatedAt.toISO() ?? null,
        }
      }),
    }

    return inertia.render('UserHome/userHome', dto)
  }
}
