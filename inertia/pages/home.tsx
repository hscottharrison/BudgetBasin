import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '~/components/ui/card'
import {
  Separator
} from '~/components/ui/separator'
import {
  ArrowRight,
  Lock,
  PieChart,
  Zap,
  CheckCircle2,
} from 'lucide-react'
import * as Accordion from '@radix-ui/react-accordion'
import { cn } from '~/lib/utils'

// Replace with your brand name and links
const APP_NAME = 'BudgetBasin'

export default function LandingPage() {
  return (
    <div className="max-h-full h-full overflow-auto">
      {/* Hero */}
      <div
        id="hero"
        className="h-full border-b"
        style={{
          background:
            'radial-gradient(1200px 600px at 80% -50%, hsl(var(--accent)), transparent), linear-gradient(180deg, hsl(var(--accent) / 0.2), hsl(var(--background)))',
        }}
      >
        <div className="container mx-auto h-full">
          <div className="flex flex-col items-center justify-center py-16 gap-6 h-full">
            <h1 className="text-5xl md:text-7xl font-bold text-center leading-tight">
              Give every dollar a job—without opening new accounts.
            </h1>
            <p className="text-xl text-muted-foreground text-center max-w-3xl">
              Connect or enter your accounts, create buckets, and allocate your cash to the goals that
              matter—house, travel, emergencies, anything.
            </p>
            <div className="flex gap-4 flex-wrap items-center justify-center">
              <a href="/register">
                <Button size="lg">
                  Start your first bucket <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </a>
              <a href="/login">
                <Button variant="outline" size="lg">
                  Sign In
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* How it works */}
      <div id="how" className="bg-muted/50">
        <div className="container mx-auto">
          <div className="flex flex-col gap-6 py-16">
            <h2 className="text-4xl md:text-5xl font-bold">How it works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium w-fit mb-2">
                    Step 1
                  </span>
                  <CardTitle>Add your savings</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Add balances manually or connect your accounts (coming soon). See your total savings
                    in one place.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium w-fit mb-2">
                    Step 2
                  </span>
                  <CardTitle>Create buckets</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Name your goals—Emergency, Down Payment, Travel. Set target amounts and optional
                    dates.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium w-fit mb-2">
                    Step 3
                  </span>
                  <CardTitle>Allocate with confidence</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Watch progress update instantly as balances change.
                  </p>
                </CardContent>
              </Card>
            </div>
            <div>
              <a href="/register">
                <Button>Start your first bucket</Button>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div id="features" className="bg-background">
        <div className="container mx-auto">
          <div className="flex flex-col gap-6 py-16">
            <h2 className="text-4xl md:text-5xl font-bold">Why {APP_NAME}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5" />
                    Buckets without bank juggling
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Keep your money where it already lives. Organize savings visually—no new accounts or
                    messy transfers.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    Allocation you can trust
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Distribute your money to meet your goals. See what's fully funded, underfunded, or
                    unallocated.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5" />
                    Built for real life
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Priorities change. Reorder goals, adjust targets, or reallocate in seconds—everything
                    updates instantly.
                  </p>
                </CardContent>
              </Card>
            </div>
            <div>
              <Button variant="outline">Try the demo</Button>
            </div>
          </div>
        </div>
      </div>

      {/* Security */}
      <div id="security" className="bg-muted/50 border-t">
        <div className="container mx-auto">
          <div className="flex flex-col gap-6 py-16">
            <h2 className="text-4xl md:text-5xl font-bold">Security & Privacy</h2>
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="pt-6">
                <div className="flex gap-4">
                  <Lock className="h-6 w-6 flex-shrink-0 text-primary" />
                  <div>
                    <p className="font-semibold mb-2">Private by design.</p>
                    <p className="text-muted-foreground">
                      We only ask for what's needed to show your savings and progress. When available,
                      connections are read‑only and your data is protected with industry‑standard
                      encryption.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <p className="text-sm text-muted-foreground">
              Replace this placeholder with your exact providers, policies, and security statement.
            </p>
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div id="pricing" className="bg-background">
        <div className="container mx-auto">
          <div className="flex flex-col gap-6 py-16">
            <h2 className="text-4xl md:text-5xl font-bold">Pricing</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <span className="inline-block px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm font-medium w-fit mb-2">
                    Beta
                  </span>
                  <CardTitle>Free during beta</CardTitle>
                  <CardDescription>
                    Unlimited buckets and core features while we refine the experience.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <a href="/register">
                    <Button>Join the beta</Button>
                  </a>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div id="faq" className="bg-muted/50 border-t">
        <div className="container mx-auto">
          <div className="flex flex-col gap-6 py-16">
            <h2 className="text-4xl md:text-5xl font-bold">FAQ</h2>
            <Accordion.Root type="single" collapsible className="space-y-2">
              {faqItems.map((item, i) => (
                <Accordion.Item key={i} value={`item-${i}`}>
                  <Accordion.Header>
                    <Accordion.Trigger asChild>
                      <button className="w-full text-left p-4 bg-card rounded-lg border hover:bg-accent transition-colors">
                        <h3 className="text-lg font-semibold">{item.q}</h3>
                      </button>
                    </Accordion.Trigger>
                  </Accordion.Header>
                  <Accordion.Content asChild>
                    <div className="px-4 pb-4">
                      <p className="text-muted-foreground">{item.a}</p>
                    </div>
                  </Accordion.Content>
                </Accordion.Item>
              ))}
            </Accordion.Root>
          </div>
        </div>
      </div>

      {/* CTA band */}
      <div
        className="border-t"
        style={{
          background: 'linear-gradient(90deg, hsl(var(--accent)), hsl(var(--primary)))',
        }}
      >
        <div className="container mx-auto">
          <div className="flex items-center justify-between py-12 flex-wrap gap-6">
            <h2 className="text-3xl md:text-4xl font-bold">Ready to see your savings—sorted?</h2>
            <div className="flex gap-4">
              <Button size="lg">
                Get started free <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="secondary">
                Watch a 60‑second tour
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-muted/50">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between py-12 gap-6">
            <div className="flex flex-col gap-2">
              <p className="font-bold">{APP_NAME}</p>
              <p className="text-sm text-muted-foreground">Your savings, sorted.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const faqItems = [
  {
    q: 'Do I have to move money between banks?',
    a: "No. Buckets are a planning layer that sits on top of your existing accounts. Keep your money where it is; get clarity on what it's for.",
  },
  {
    q: 'Will this affect my credit or my bank?',
    a: "No. Viewing balances and allocating buckets doesn't touch your credit and doesn't change your bank accounts.",
  },
  {
    q: 'What if my priorities change?',
    a: 'Reallocate in seconds. Your targets, timeline, and progress update instantly.',
  },
  {
    q: 'Is my data safe?',
    a: 'We use industry‑standard encryption and follow strict data‑handling practices. See our Security page for details.',
  },
]
