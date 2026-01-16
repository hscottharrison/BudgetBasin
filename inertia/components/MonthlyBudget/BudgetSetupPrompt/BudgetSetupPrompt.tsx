import { Button } from '~/components/ui/button'
import { Calendar, Plus, Check } from 'lucide-react'
import { cn } from '~/lib/utils'

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
  if (!hasCategories || !hasTemplate) {
    return (
      <div className="border border-border bg-card">
        <div className="py-12 px-6">
          <div className="flex flex-col items-center gap-6 max-w-md mx-auto">
            <div className="w-16 h-16 border-2 border-muted-foreground flex items-center justify-center">
              <Calendar size={32} strokeWidth={1} className="text-muted-foreground" />
            </div>
            
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">Set Up Your Budget</h2>
              <p className="text-sm text-muted-foreground">
                Create categories, set targets, and start tracking your spending.
              </p>
            </div>

            <div className="w-full space-y-2">
              <SetupStep
                number={1}
                title="Add Categories"
                description="Income sources and expense categories"
                completed={hasCategories}
              />
              <SetupStep
                number={2}
                title="Set Targets"
                description="Expected income and budget limits"
                completed={hasTemplate}
              />
              <SetupStep
                number={3}
                title="Start Tracking"
                description="Begin your first budget period"
                completed={hasPeriod}
              />
            </div>

            <Button onClick={() => setShowCreateBudgetForm(true)} className="rounded-none">
              <Plus size={16} />
              Get Started
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (!hasPeriod) {
    const now = new Date()
    const monthName = now.toLocaleString('default', { month: 'long' })
    const year = now.getFullYear()

    return (
      <div className="border border-border bg-card">
        <div className="py-12 px-6">
          <div className="flex flex-col items-center gap-6 max-w-md mx-auto">
            <div className="w-16 h-16 border-2 border-green-600 flex items-center justify-center">
              <Calendar size={32} strokeWidth={1} className="text-green-600" />
            </div>
            
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">Ready for {monthName}?</h2>
              <p className="text-sm text-muted-foreground">
                Your template is ready. Start tracking for {monthName} {year}.
              </p>
            </div>

            <Button onClick={onCreatePeriod} className="rounded-none">
              <Plus size={16} />
              Start {monthName} Budget
            </Button>
          </div>
        </div>
      </div>
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
    <div className={cn(
      'flex items-center gap-3 p-3 border border-border',
      completed ? 'bg-green-50 border-green-200' : 'bg-background'
    )}>
      <div className={cn(
        'w-6 h-6 flex items-center justify-center text-xs font-bold border',
        completed 
          ? 'border-green-600 bg-green-600 text-white' 
          : 'border-muted-foreground text-muted-foreground'
      )}>
        {completed ? <Check size={14} /> : number}
      </div>
      <div className="flex-1 min-w-0">
        <p className={cn(
          'text-sm font-medium',
          completed && 'text-green-700'
        )}>{title}</p>
        <p className="text-xs text-muted-foreground truncate">{description}</p>
      </div>
    </div>
  )
}
