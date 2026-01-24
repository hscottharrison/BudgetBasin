import { useState } from 'react'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '~/components/ui/card'

type PricingInfo = {
  monthly: { priceId: string; amount: number; interval: string }
  free: { priceId: string; amount: number; interval: string }
  yearly: { priceId: string; amount: number; interval: string; savings: string }
  trialDays: number
}

type SubscriptionDTO = {
  id: number
  status: string
  isActive: boolean
  isTrial: boolean
  trialEndsAt: string | null
  currentPeriodEnd: string | null
  canceledAt: string | null
  endsAt: string | null
}

type Props = {
  subscription: SubscriptionDTO | null
  pricing: PricingInfo
}

export default function Subscription({ subscription, pricing }: Props) {
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  console.log('PRICING', pricing)
  async function handleCheckout(priceId: string) {
    setLoading(priceId)
    setError(null)
    try {
      const res = await fetch('/api/subscription/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        setError('Unable to start checkout. Please try again.')
      }
    } catch (err) {
      console.error('Checkout error:', err)
      setError('Unable to start checkout. Please try again.')
    } finally {
      setLoading(null)
    }
  }

  async function handleManageSubscription() {
    setLoading('portal')
    setError(null)
    try {
      const res = await fetch('/api/subscription/portal', { method: 'POST' })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        setError('Unable to open subscription management. Please try again.')
      }
    } catch (err) {
      console.error('Portal error:', err)
      setError('Unable to open subscription management. Please try again.')
    } finally {
      setLoading(null)
    }
  }

  // Show manage subscription if user has active subscription
  if (subscription?.isActive) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Your Subscription</CardTitle>
            <CardDescription>
              {subscription.isTrial
                ? `Trial ends ${new Date(subscription.trialEndsAt!).toLocaleDateString()}`
                : `Current period ends ${new Date(subscription.currentPeriodEnd!).toLocaleDateString()}`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 mb-4 text-green-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 6 9 17l-5-5" />
              </svg>
              <span className="font-medium">
                {subscription.isTrial ? 'Trial Active' : 'Subscription Active'}
              </span>
            </div>
            <Button onClick={handleManageSubscription} disabled={loading === 'portal'}>
              {loading === 'portal' ? 'Loading...' : 'Manage Subscription'}
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Show subscription blocked a message if past_due or canceled
  if (subscription && !subscription.isActive) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <Card className="max-w-md w-full border-red-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" x2="12" y1="8" y2="12" />
                <line x1="12" x2="12.01" y1="16" y2="16" />
              </svg>
              Subscription Inactive
            </CardTitle>
            <CardDescription>
              Your subscription is {subscription.status}. Please update your payment method to
              continue.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleManageSubscription} disabled={loading === 'portal'}>
              {loading === 'portal' ? 'Loading...' : 'Update Payment Method'}
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Show pricing for new users
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Choose Your Plan</h1>
        <p className="text-gray-600">
          Start your {pricing.trialDays}-day free trial today. Cancel anytime.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md max-w-md w-full text-center">
          {error}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6 max-w-3xl w-full">
        {/* Free Plan */}
        <Card>
          <CardHeader>
            <CardTitle>Forever</CardTitle>
            <CardDescription>
              <span className="text-3xl font-bold text-foreground">FREE</span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 mb-6">
              <PlanFeature>Full access to basic features</PlanFeature>
            </ul>
            <Button
              className="w-full"
              variant="outline"
              onClick={() => handleCheckout(pricing.free.priceId)}
              disabled={loading === pricing.free.priceId}
            >
              {loading === pricing.free.priceId ? 'Loading...' : 'Get Started'}
            </Button>
          </CardContent>
        </Card>
        {/* Monthly Plan */}
        {/*<Card>*/}
        {/*  <CardHeader>*/}
        {/*    <CardTitle>Monthly</CardTitle>*/}
        {/*    <CardDescription>*/}
        {/*      <span className="text-3xl font-bold text-foreground">${pricing.monthly.amount}</span>*/}
        {/*      <span className="text-gray-500">/month</span>*/}
        {/*    </CardDescription>*/}
        {/*  </CardHeader>*/}
        {/*  <CardContent>*/}
        {/*    <ul className="space-y-2 mb-6">*/}
        {/*      <PlanFeature>Full access to all features</PlanFeature>*/}
        {/*      <PlanFeature>{pricing.trialDays}-day free trial</PlanFeature>*/}
        {/*      <PlanFeature>Cancel anytime</PlanFeature>*/}
        {/*    </ul>*/}
        {/*    <Button*/}
        {/*      className="w-full"*/}
        {/*      variant="outline"*/}
        {/*      onClick={() => handleCheckout(pricing.monthly.priceId)}*/}
        {/*      disabled={loading === pricing.monthly.priceId}*/}
        {/*    >*/}
        {/*      {loading === pricing.monthly.priceId ? 'Loading...' : 'Start Free Trial'}*/}
        {/*    </Button>*/}
        {/*  </CardContent>*/}
        {/*</Card>*/}

        {/* Yearly Plan */}
        {/*<Card className="border-2 border-primary relative">*/}
        {/*  <div className="absolute -top-3 right-4 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">*/}
        {/*    Save {pricing.yearly.savings}*/}
        {/*  </div>*/}
        {/*  <CardHeader>*/}
        {/*    <CardTitle>Yearly</CardTitle>*/}
        {/*    <CardDescription>*/}
        {/*      <span className="text-3xl font-bold text-foreground">${pricing.yearly.amount}</span>*/}
        {/*      <span className="text-gray-500">/year</span>*/}
        {/*    </CardDescription>*/}
        {/*  </CardHeader>*/}
        {/*  <CardContent>*/}
        {/*    <ul className="space-y-2 mb-6">*/}
        {/*      <PlanFeature>Full access to all features</PlanFeature>*/}
        {/*      <PlanFeature>{pricing.trialDays}-day free trial</PlanFeature>*/}
        {/*      <PlanFeature>Cancel anytime</PlanFeature>*/}
        {/*      <PlanFeature>*/}
        {/*        Save ${(pricing.monthly.amount * 12 - pricing.yearly.amount).toFixed(2)}/year*/}
        {/*      </PlanFeature>*/}
        {/*    </ul>*/}
        {/*    <Button*/}
        {/*      className="w-full"*/}
        {/*      onClick={() => handleCheckout(pricing.yearly.priceId)}*/}
        {/*      disabled={loading === pricing.yearly.priceId}*/}
        {/*    >*/}
        {/*      {loading === pricing.yearly.priceId ? 'Loading...' : 'Start Free Trial'}*/}
        {/*    </Button>*/}
        {/*  </CardContent>*/}
        {/*</Card>*/}
      </div>
    </div>
  )
}

function PlanFeature({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-center gap-2">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-green-600"
      >
        <path d="M20 6 9 17l-5-5" />
      </svg>
      {children}
    </li>
  )
}
