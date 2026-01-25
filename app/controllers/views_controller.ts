import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import AccountsService from '#services/accounts_service'
import BucketsService from '#services/buckets_service'
import EnumService from '#services/enum_service'
import BudgetService from '#services/budget_service'
import StripeService from '#services/stripe_service'
import Subscription from '#models/subscription'

@inject()
export default class ViewsController {
  constructor(
    private accountService: AccountsService,
    private bucketsService: BucketsService,
    private enumService: EnumService,
    private budgetService: BudgetService,
    private stripeService: StripeService
  ) {}
  async landing({ inertia }: HttpContext) {
    return inertia.render('LandingPage/landingPage')
  }

  async login({ inertia }: HttpContext) {
    return inertia.render('Login/login')
  }

  async register({ inertia }: HttpContext) {
    return inertia.render('Register/register')
  }

  async userHome({ inertia, auth }: HttpContext) {
    const dto = {
      user: {
        firstName: auth?.user?.firstName || '',
        lastName: auth?.user?.lastName || '',
      },
    }
    return inertia.render('UserHome/userHome', dto)
  }

  async savings({ inertia, auth }: HttpContext) {
    const userAccounts = await this.accountService.GetSavingsAccountsForUser(auth?.user?.id ?? 0)
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

    return inertia.render('Savings/savings', dto)
  }

  async monthlyBudget({ inertia, auth, response }: HttpContext) {
    const userId = auth?.user?.id ?? 0
    const currentPeriod = await this.budgetService.getCurrentPeriodForUser(userId)
    if (currentPeriod) {
      response.redirect(`/monthly-budget/${currentPeriod.id}`)
    } else {
      return inertia.render('MonthlyBudget/monthlyBudget')
    }
  }

  async monthlyBudgetByPeriodId({ auth, inertia, params }: HttpContext) {
    const periodId = params.id
    const userId = auth?.user?.id ?? 0
    const categories = await this.budgetService.getCategoriesForUser(userId)
    const template = await this.budgetService.getActiveTemplateForUser(userId)
    const currentPeriod = await this.budgetService.getPeriodById(periodId)
    const checkingAccount = await this.budgetService.getCheckingAccountForUser(userId)

    return inertia.render('MonthlyBudget/monthlyBudget', {
      user: {
        firstName: auth?.user?.firstName || '',
        lastName: auth?.user?.lastName || '',
      },
      categories,
      template,
      currentPeriod,
      checkingAccount,
    })
  }

  async subscription({ inertia, auth }: HttpContext) {
    const user = auth.user!
    const subscription = await Subscription.query().where('userId', user.id).first()
    const pricing = this.stripeService.getPricingInfo()

    return inertia.render('Subscription/subscription', {
      subscription: subscription?.toDTO() ?? null,
      pricing,
    })
  }

  async subscriptionSuccess({ inertia }: HttpContext) {
    return inertia.render('Subscription/subscriptionSuccess')
  }
}
