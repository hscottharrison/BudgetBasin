import Stripe from 'stripe'
import env from '#start/env'
import User from '#models/user'
import Subscription, { SubscriptionStatus } from '#models/subscription'
import { DateTime } from 'luxon'

export default class StripeService {
  private stripe: Stripe

  constructor() {
    this.stripe = new Stripe(env.get('STRIPE_SECRET_KEY'))
  }

  /**
   * Create a Stripe customer for a user
   */
  async createCustomer(user: User): Promise<string> {
    const customer = await this.stripe.customers.create({
      email: user.email,
      name: `${user.firstName} ${user.lastName}`,
      metadata: {
        userId: user.id.toString(),
      },
    })

    user.stripeCustomerId = customer.id
    await user.save()

    return customer.id
  }

  /**
   * Get or create Stripe customer for a user
   */
  async getOrCreateCustomer(user: User): Promise<string> {
    if (user.stripeCustomerId) {
      return user.stripeCustomerId
    }
    return this.createCustomer(user)
  }

  /**
   * Create a Stripe Checkout session for subscription
   */
  async createCheckoutSession(
    user: User,
    priceId: string,
    successUrl: string,
    cancelUrl: string
  ): Promise<string> {
    const customerId = await this.getOrCreateCustomer(user)

    const session = await this.stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      subscription_data: {
        trial_period_days: 7,
        metadata: {
          userId: user.id.toString(),
        },
      },
      success_url: successUrl,
      cancel_url: cancelUrl,
      allow_promotion_codes: true,
    })

    if (!session.url) {
      throw new Error('Stripe did not return a checkout URL')
    }

    return session.url
  }

  /**
   * Create a Stripe Customer Portal session
   */
  async createPortalSession(user: User, returnUrl: string): Promise<string> {
    if (!user.stripeCustomerId) {
      throw new Error('User does not have a Stripe customer ID')
    }

    const session = await this.stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: returnUrl,
    })

    return session.url
  }

  /**
   * Get subscription for a user
   */
  async getSubscription(userId: number): Promise<Subscription | null> {
    return Subscription.query().where('userId', userId).first()
  }

  /**
   * Create or update subscription from Stripe webhook
   */
  async syncSubscription(stripeSubscription: Stripe.Subscription): Promise<Subscription> {
    const customerId = stripeSubscription.customer as string

    // Find user by stripe customer ID, or fall back to metadata.userId
    let user = await User.query().where('stripeCustomerId', customerId).first()

    // Fallback: if customer ID not yet saved (race condition), use metadata
    if (!user && stripeSubscription.metadata?.userId) {
      const userId = Number.parseInt(stripeSubscription.metadata.userId, 10)
      user = await User.query().where('id', userId).first()

      // If found via metadata, update the stripeCustomerId for future lookups
      if (user && !user.stripeCustomerId) {
        user.stripeCustomerId = customerId
        await user.save()
      }
    }

    if (!user) {
      throw new Error(`No user found for Stripe customer: ${customerId}`)
    }

    let subscription = await Subscription.query().where('userId', user.id).first()

    // Cast to any to access properties that may vary by Stripe API version
    const sub = stripeSubscription as any

    const subscriptionData = {
      userId: user.id,
      stripeCustomerId: customerId,
      stripeSubscriptionId: stripeSubscription.id,
      stripePriceId: stripeSubscription.items.data[0]?.price.id ?? null,
      status: stripeSubscription.status as SubscriptionStatus,
      trialEndsAt: sub.trial_end ? DateTime.fromSeconds(sub.trial_end) : null,
      currentPeriodStart: sub.current_period_start
        ? DateTime.fromSeconds(sub.current_period_start)
        : null,
      currentPeriodEnd: sub.current_period_end
        ? DateTime.fromSeconds(sub.current_period_end)
        : null,
      canceledAt: sub.canceled_at ? DateTime.fromSeconds(sub.canceled_at) : null,
      endsAt: sub.cancel_at ? DateTime.fromSeconds(sub.cancel_at) : null,
    }

    if (subscription) {
      subscription.merge(subscriptionData)
      await subscription.save()
    } else {
      subscription = await Subscription.create(subscriptionData)
    }

    return subscription
  }

  /**
   * Handle subscription deleted
   */
  async handleSubscriptionDeleted(stripeSubscription: Stripe.Subscription): Promise<void> {
    const subscription = await Subscription.query()
      .where('stripeSubscriptionId', stripeSubscription.id)
      .first()

    if (subscription) {
      subscription.status = 'canceled'
      subscription.canceledAt = DateTime.now()
      await subscription.save()
    }
  }

  /**
   * Construct and verify webhook event
   */
  constructWebhookEvent(payload: string, signature: string): Stripe.Event {
    return this.stripe.webhooks.constructEvent(payload, signature, env.get('STRIPE_WEBHOOK_SECRET'))
  }

  /**
   * Get pricing info for display
   */
  getPricingInfo() {
    return {
      free: {
        priceId: env.get('STRIPE_FREE_PRICE_ID'),
        amount: 0,
        interval: 'Flat Rate',
      },
      monthly: {
        priceId: env.get('STRIPE_MONTHLY_PRICE_ID'),
        amount: 2.99,
        interval: 'month',
      },
      yearly: {
        priceId: env.get('STRIPE_YEARLY_PRICE_ID'),
        amount: 24.99,
        interval: 'year',
        savings: '30%',
      },
      trialDays: 7,
    }
  }
}
