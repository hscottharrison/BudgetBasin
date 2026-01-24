import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import StripeService from '#services/stripe_service'
import env from '#start/env'

@inject()
export default class SubscriptionController {
  constructor(private stripeService: StripeService) {}

  /**
   * POST /api/subscription/checkout
   * Create Stripe Checkout session and return URL
   */
  async createCheckout({ request, auth, response }: HttpContext) {
    const user = auth.user!
    const { priceId } = request.only(['priceId'])

    const pricing = this.stripeService.getPricingInfo()
    const validPriceIds = [pricing.free.priceId, pricing.monthly.priceId, pricing.yearly.priceId]

    if (!validPriceIds.includes(priceId)) {
      return response.badRequest({ error: 'Invalid price ID' })
    }

    try {
      const appUrl = env.get('APP_URL')
      const checkoutUrl = await this.stripeService.createCheckoutSession(
        user,
        priceId,
        `${appUrl}/subscription/success`,
        `${appUrl}/subscription`
      )

      return response.ok({ url: checkoutUrl })
    } catch (error) {
      console.error('Checkout session error:', error)
      return response.internalServerError({ error: 'Failed to create checkout session' })
    }
  }

  /**
   * POST /api/subscription/portal
   * Create Stripe Customer Portal session and return URL
   */
  async createPortal({ auth, response }: HttpContext) {
    const user = auth.user!

    if (!user.stripeCustomerId) {
      return response.badRequest({ error: 'No subscription found' })
    }

    try {
      const appUrl = env.get('APP_URL')
      const portalUrl = await this.stripeService.createPortalSession(user, `${appUrl}/user-home`)

      return response.ok({ url: portalUrl })
    } catch (error) {
      console.error('Portal session error:', error)
      return response.internalServerError({ error: 'Failed to create portal session' })
    }
  }

  /**
   * POST /api/webhooks/stripe
   * Handle Stripe webhooks
   */
  async handleWebhook({ request, response }: HttpContext) {
    const signature = request.header('stripe-signature')

    if (!signature) {
      return response.badRequest({ error: 'Missing stripe-signature header' })
    }

    const rawBody = request.raw()
    if (!rawBody) {
      return response.badRequest({ error: 'Missing request body' })
    }

    let event

    try {
      event = this.stripeService.constructWebhookEvent(rawBody, signature)
    } catch (error) {
      console.error('Webhook signature verification failed:', error)
      return response.badRequest({ error: 'Invalid signature' })
    }

    try {
      switch (event.type) {
        case 'customer.subscription.created':
        case 'customer.subscription.updated':
          await this.stripeService.syncSubscription(event.data.object)
          break

        case 'customer.subscription.deleted':
          await this.stripeService.handleSubscriptionDeleted(event.data.object)
          break

        case 'invoice.payment_failed':
          console.log('Payment failed for invoice:', event.data.object.id)
          break

        case 'invoice.payment_succeeded':
          console.log('Payment succeeded for invoice:', event.data.object.id)
          break

        default:
          console.log(`Unhandled event type: ${event.type}`)
      }

      return response.ok({ received: true })
    } catch (error) {
      console.error('Webhook handler error:', error)
      return response.internalServerError({ error: 'Webhook handler failed' })
    }
  }

  /**
   * GET /api/subscription/status
   * Get current subscription status
   */
  async getStatus({ auth, response }: HttpContext) {
    const user = auth.user!
    const subscription = await this.stripeService.getSubscription(user.id)
    const pricing = this.stripeService.getPricingInfo()

    return response.ok({
      subscription: subscription?.toDTO() ?? null,
      pricing,
    })
  }
}
