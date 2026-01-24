import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import Subscription from '#models/subscription'

/**
 * Subscription middleware ensures user has an active subscription.
 * Redirects to subscription page if subscription is inactive.
 */
export default class SubscriptionMiddleware {
  redirectTo = '/subscription'

  async handle(ctx: HttpContext, next: NextFn) {
    const user = ctx.auth.user

    if (!user) {
      return ctx.response.redirect('/login')
    }

    const subscription = await Subscription.query().where('userId', user.id).first()

    // No subscription or inactive subscription
    if (!subscription || !subscription.isActive) {
      // For API requests, return JSON error
      if (ctx.request.url().startsWith('/api/')) {
        return ctx.response.paymentRequired({
          error: 'subscription_required',
          message: 'An active subscription is required to access this resource.',
        })
      }

      // For page requests, redirect to subscription page
      return ctx.response.redirect(this.redirectTo)
    }

    return next()
  }
}
