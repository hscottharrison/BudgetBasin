import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '~/components/ui/card'
import {
  ArrowRight,
  Lock,
  PieChart,
  Zap,
  CheckCircle2,
  Calendar,
  Wallet
} from 'lucide-react'
import * as Accordion from '@radix-ui/react-accordion'

const APP_NAME = 'BudgetBasin'

const demoItems = [
  {
    title: 'Buckets overview',
    description: 'See your goals and what’s allocated in seconds.',
    imageSrc: 'https://xmobqcpkmnftkqqxdjkx.supabase.co/storage/v1/object/sign/BudgetBasinDemo/track_savings.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83YzRkNjM2MS00OTk0LTQ0NjEtOWZkYS0zYzIzNTEzZWIzMTYiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJCdWRnZXRCYXNpbkRlbW8vdHJhY2tfc2F2aW5ncy5wbmciLCJpYXQiOjE3NjkyODY0NTMsImV4cCI6MTgwMDgyMjQ1M30.enhtxSuqwMomQxcrcznTH47pTsOCU9guLlI6U5MAUQg',
    alt: 'Buckets overview screenshot',
  },
  {
    title: 'Budget template',
    description: 'Create a reusable monthly plan with categories and planned amounts.',
    imageSrc: '/images/demos/budget-template.png',
    alt: 'Budget template screenshot',
  },
  {
    title: 'Monthly tracking',
    description: 'Start a month and track planned vs actual spending as you enter transactions.',
    imageSrc: '/images/demos/monthly-tracking.png',
    alt: 'Monthly tracking screenshot',
  },
]

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
              Organize savings with buckets, and set a monthly budget template to plan your spending—two
              simple tools you can use side-by-side.
            </p>

            <div className="flex gap-4 flex-wrap items-center justify-center">
              <a href="/register">
                <Button size="lg">
                  Start free <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </a>
              <a href="/login">
                <Button variant="outline" size="lg">
                  Sign In
                </Button>
              </a>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap justify-center">
              <span className="inline-flex items-center gap-2 rounded-full border bg-background/60 px-3 py-1">
                <PieChart className="h-4 w-4" />
                Buckets for goals
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border bg-background/60 px-3 py-1">
                <Calendar className="h-4 w-4" />
                Monthly budget templates
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border bg-background/60 px-3 py-1">
                <Lock className="h-4 w-4" />
                Privacy-first
              </span>
            </div>

            <p className="text-sm text-muted-foreground text-center max-w-2xl">
              Transactions are currently entered manually so you stay in control of what you track.
            </p>
          </div>
        </div>
      </div>

      {/* How it works */}
      <div id="how" className="bg-muted/50">
        <div className="container mx-auto">
          <div className="flex flex-col gap-6 py-16">
            <h2 className="text-4xl md:text-5xl font-bold">How it works</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader>
                  <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium w-fit mb-2">
                    Step 1
                  </span>
                  <CardTitle>Add Your Accounts</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Add your checking and savings accounts to your BudgetBasin profile along with your balances. This will serve as a starting point and allow you to reconcile your budgets with your accounts.
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
                    Name your goals—Emergency, Down Payment, Travel. Set target amounts and optional dates.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium w-fit mb-2">
                    Step 3
                  </span>
                  <CardTitle>Allocate your savings</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Assign dollars to goals and immediately see what’s funded, underfunded, or unallocated.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium w-fit mb-2">
                    Step 4
                  </span>
                  <CardTitle>Build a budget template</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Create categories and planned amounts once, then reuse them each month. You can create
                    multiple budgets for different plans.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium w-fit mb-2">
                    Step 5
                  </span>
                  <CardTitle>Start a month & track</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Start a new month and track actual spending against your plan as
                    you enter transactions.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="flex gap-3 flex-wrap">
              <a href="/register">
                <Button>Start free</Button>
              </a>
              <a href="#demos">
                <Button variant="outline">See screenshots</Button>
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
                    Keep your money where it already lives. Buckets are a planning layer on top of your
                    existing accounts.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wallet className="h-5 w-5" />
                    A budget that starts with intention
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Use templates (categories + planned amounts) to set a monthly plan, then track how you
                    actually spend.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    Manual tracking, on purpose
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Enter transactions manually and reconcile with your checking account’s running balance
                    to keep things accurate.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5" />
                    Know what you can save
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    When you know what you spend, you can make clearer tradeoffs and fund the goals that
                    matter most.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="flex gap-3 flex-wrap">
              <a href="#demos">
                <Button variant="outline">View screenshots</Button>
              </a>
              <a href="/register">
                <Button>Get started</Button>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Screenshots */}
      <div id="demos" className="bg-muted/50 border-t">
        <div className="container mx-auto">
          <div className="flex flex-col gap-6 py-16">
            <h2 className="text-4xl md:text-5xl font-bold">Screenshots</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="overflow-hidden">
                <CardHeader>
                  <CardTitle>{demoItems[0].title}</CardTitle>
                  <CardDescription>{demoItems[0].description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <img
                    src={demoItems[0].imageSrc}
                    alt={demoItems[0].alt}
                    className="rounded-lg border"
                  />
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 gap-6">
                {demoItems.slice(1).map((item) => (
                  <Card key={item.title}>
                    <CardHeader>
                      <CardTitle>{item.title}</CardTitle>
                      <CardDescription>{item.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <img src={item.imageSrc} alt={item.alt} className="rounded-lg border" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div id="faq" className="bg-background border-t">
        <div className="container mx-auto py-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">FAQ</h2>
          <Accordion.Root type="single" collapsible className="space-y-2">
            {faqItems.map((item, i) => (
              <Accordion.Item key={i} value={`item-${i}`}>
                <Accordion.Header>
                  <Accordion.Trigger className="w-full text-left p-4 bg-card rounded-lg border">
                    {item.q}
                  </Accordion.Trigger>
                </Accordion.Header>
                <Accordion.Content className="p-4 text-muted-foreground">
                  {item.a}
                </Accordion.Content>
              </Accordion.Item>
            ))}
          </Accordion.Root>
        </div>
      </div>
    </div>
  )
}

const faqItems = [
  {
    q: 'How does the monthly budget work?',
    a: 'Budgets are templates (categories + planned amounts). When you start a month, you track actual spending against that plan.',
  },
  {
    q: 'Do budgets roll over?',
    a: 'No. Each month resets so you can start fresh.',
  },
  {
    q: 'Are buckets and budgets connected?',
    a: 'Not yet. They are separate tools you can use side-by-side.',
  },
]
