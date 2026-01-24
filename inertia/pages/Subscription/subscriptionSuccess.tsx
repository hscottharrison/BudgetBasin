import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '~/components/ui/card'

export default function SubscriptionSuccess() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-green-600"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <path d="M22 4 12 14.01l-3-3" />
            </svg>
          </div>
          <CardTitle>Welcome to Budget Basin!</CardTitle>
          <CardDescription>
            Your subscription has been activated. Your 7-day free trial has started.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <a href="/user-home">
            <Button size="lg">Get Started</Button>
          </a>
        </CardContent>
      </Card>
    </div>
  )
}
