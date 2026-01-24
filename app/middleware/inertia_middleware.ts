import type { HttpContext } from '@adonisjs/core/http'
import { BaseDTO, SubscriptionStatusDTO } from '#models/base_dto'
import { Data } from '@adonisjs/inertia/types'
import Subscription from '#models/subscription'

export default class InertiaShareMiddleware {
  public async handle(ctx: HttpContext, next: () => Promise<void>) {
    const user = ctx.auth?.use('web')?.user

    let subscriptionStatus: SubscriptionStatusDTO | null = null
    if (user) {
      const subscription = await Subscription.query().where('userId', user.id).first()
      if (subscription) {
        subscriptionStatus = {
          isActive: subscription.isActive,
          isTrial: subscription.isTrial,
          status: subscription.status,
          trialEndsAt: subscription.trialEndsAt?.toISO() ?? null,
          currentPeriodEnd: subscription.currentPeriodEnd?.toISO() ?? null,
        }
      }
    }

    const shared: BaseDTO = {
      user: user
        ? {
            firstName: user.firstName,
            lastName: user.lastName,
          }
        : null,
      subscription: subscriptionStatus,
    }

    // @ts-ignore
    ctx.inertia.share(shared satisfies Record<string, Data>)
    await next()
  }
}
