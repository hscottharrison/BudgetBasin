import { Button } from '~/components/ui/button'
import { Card, CardContent } from '~/components/ui/card'
import { CalendarIcon, PlusIcon } from 'lucide-react'
import { cn } from '~/lib/utils'
import './style.css'

interface BudgetSetupPromptProps {
  hasCategories: boolean
  hasTemplate: boolean
  hasPeriod: boolean
  onCreatePeriod: () => void
  setShowCreateBudgetForm: (show: boolean) => void
}

export default function BudgetSetupPrompt({
  hasCategories,
  hasTemplate,
  hasPeriod,
  onCreatePeriod,
  setShowCreateBudgetForm,
}: BudgetSetupPromptProps) {
  // User hasn't set up anything yet
  if (!hasCategories || !hasTemplate) {
    return (
      <Card className="budget-setup-card">
        <CardContent className="py-12">
          <div className="flex flex-col items-center gap-4">
            <div className="setup-icon">
              <CalendarIcon size={48} strokeWidth={1.5} />
            </div>
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Let's Set Up Your Budget!</h2>
              <p className="text-sm text-muted-foreground max-w-md">
                Create income and expense categories, set your monthly targets, and start tracking
                your spending.
              </p>
            </div>

            <div className="flex flex-col gap-3 mt-2">
              <SetupStep
                number={1}
                title="Add Categories"
                description="Create income sources and expense categories"
                completed={hasCategories}
              />
              <SetupStep
                number={2}
                title="Set Targets"
                description="Define your expected income and budget limits"
                completed={hasTemplate}
              />
              <SetupStep
                number={3}
                title="Start Tracking"
                description="Begin your first budget period"
                completed={hasPeriod}
              />
            </div>

            <Button size="lg" className="mt-4" onClick={() => setShowCreateBudgetForm(true)}>
              <PlusIcon size={18} />
              Get Started
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  // User has categories and template, but no active period
  if (!hasPeriod) {
    const now = new Date()
    const monthName = now.toLocaleString('default', { month: 'long' })
    const year = now.getFullYear()

    return (
      <Card className="budget-setup-card">
        <CardContent className="py-12">
          <div className="flex flex-col items-center gap-4">
            <div className="setup-icon ready">
              <CalendarIcon size={48} strokeWidth={1.5} />
            </div>
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Ready to Start {monthName}?</h2>
              <p className="text-sm text-muted-foreground max-w-md">
                Your budget template is set up. Start a new period to begin tracking your income
                and expenses for {monthName} {year}.
              </p>
            </div>

            <Button size="lg" className="mt-4" onClick={onCreatePeriod}>
              <PlusIcon size={18} />
              Start {monthName} Budget
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return null
}

interface SetupStepProps {
  number: number
  title: string
  description: string
  completed: boolean
}

function SetupStep({ number, title, description, completed }: SetupStepProps) {
  return (
    <div className={cn('setup-step flex items-start gap-3', completed && 'completed')}>
      <div className="step-number">{completed ? '✓' : number}</div>
      <div>
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </div>
  )
}
