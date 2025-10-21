import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import AccountsService from '#services/accounts_service'
import BucketsService from '#services/buckets_service'
import EnumService from '#services/enum_service'
// import {UserHomeDTO} from "#models/user_home_dto";

@inject()
export default class ViewsController {
  constructor(
    private accountService: AccountsService,
    private bucketsService: BucketsService,
    private enumService: EnumService
  ) {}
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
    const userAccounts = await this.accountService.GetAllAccountsForUser(auth?.user?.id ?? 0)
    const buckets = await this.bucketsService.GetAllBucketsForUser(auth?.user?.id ?? 0)
    const transactionTypes = await this.enumService.GetTransactionTypes()
    const dto = {
      user: {
        firstName: auth?.user?.firstName || '',
        lastName: auth?.user?.lastName || '',
      },
      userAccounts,
      transactionTypes,
      userBuckets: buckets,
    }

    return inertia.render('UserHome/userHome', dto)
  }
}
