import { useState, useMemo } from 'react'
import Wizard, { WizardStep } from '~/components/CommonComponents/Wizard/Wizard'
import { useMonthlyBudget } from '~/context/MonthlyBudgetContext'
import { formatCurrency } from '~/services/utils_service'
import { cn } from '~/lib/utils'
import Input from '~/components/CommonComponents/Input/input'
import { Label } from '~/components/ui/label'
import { getRawValue } from '~/components/CommonComponents/Input/masks'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import { Button } from '~/components/ui/button'
import { Wallet, TrendingUp, CalendarPlus, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { startNewPeriod } from '~/services/budget_service'
import type { BudgetPeriodDTO } from '#models/budget_period'

interface StartNewPeriodWizardProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: (newPeriod: BudgetPeriodDTO) => void
}

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

export default function StartNewPeriodWizard({
  isOpen,
  onClose,
  onSuccess,
}: StartNewPeriodWizardProps) {
  const {
    currentPeriod,
    totalExpectedIncome,
    totalBudgetedExpenses,
    totalActualIncome,
    totalActualExpenses,
    checkingBalance,
    checkingAccount,
    setPeriod,
    updateCheckingBalance,
  } = useMonthlyBudget()

  // Calculate next month/year as default
  const getNextMonth = () => {
    if (!currentPeriod) {
      const now = new Date()
      return { month: now.getMonth() + 1, year: now.getFullYear() }
    }
    const nextMonth = currentPeriod.month === 12 ? 1 : currentPeriod.month + 1
    const nextYear = currentPeriod.month === 12 ? currentPeriod.year + 1 : currentPeriod.year
    return { month: nextMonth, year: nextYear }
  }

  const nextMonthYear = getNextMonth()

  const [actualBalance, setActualBalance] = useState<string>('')
  const [selectedMonth, setSelectedMonth] = useState<number>(nextMonthYear.month)
  const [selectedYear, setSelectedYear] = useState<number>(nextMonthYear.year)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Calculations
  const incomeVariance = totalActualIncome - totalExpectedIncome
  const expenseVariance = totalActualExpenses - totalBudgetedExpenses
  const expectedEndingBalance = checkingBalance + totalActualIncome - totalActualExpenses
  const rawBalance = actualBalance ? parseFloat(getRawValue(actualBalance, 'USD')) : 0
  const balanceDelta = actualBalance ? rawBalance - checkingBalance : 0
  const reconciliationVariance = actualBalance ? rawBalance - expectedEndingBalance : 0

  // Generate years (current year ± 2)
  const currentYear = new Date().getFullYear()
  const YEARS = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i)

  const handleStartNewPeriod = async () => {
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await startNewPeriod({
        year: selectedYear,
        month: selectedMonth,
        actualBalance: actualBalance ? rawBalance : undefined,
      })

      // Update context
      setPeriod(response.newPeriod)
      if (response.newBalance !== null && updateCheckingBalance) {
        updateCheckingBalance(response.newBalance)
      }

      onSuccess?.(response.newPeriod)
      onClose()
    } catch (err: any) {
      setError(err.message || 'Failed to start new period')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Step 1: Update Account Balance
  const step1Content = (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Update Account Balance</h3>
      <p className="text-sm text-muted-foreground">
        Enter your actual checking account balance from your bank statement.
      </p>

      {checkingAccount ? (
        <>
          <div className="border border-border p-4 bg-muted/30 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Current Balance (App)</span>
              <span className="text-lg font-bold tabular-nums">
                {formatCurrency(checkingBalance)}
              </span>
            </div>
          </div>

          <Input
            label="Actual Balance (Bank Statement)"
            id="actualBalance"
            type="text"
            maskType="USD"
            value={actualBalance}
            onChange={(e) => setActualBalance(e.target.value)}
            placeholder="$0.00"
          />

          {actualBalance && parseFloat(actualBalance) !== checkingBalance && (
            <div
              className={cn(
                'p-3 border rounded-lg',
                parseFloat(actualBalance) > checkingBalance
                  ? 'border-green-600 bg-green-50 text-green-800'
                  : 'border-red-600 bg-red-50 text-red-800'
              )}
            >
              <span className="text-sm font-medium">
                Delta: {balanceDelta >= 0 ? '+' : ''}
                {formatCurrency(balanceDelta)}
              </span>
            </div>
          )}
        </>
      ) : (
        <div className="p-4 border border-border bg-muted/30 rounded-lg">
          <p className="text-sm text-muted-foreground">
            No checking account found. You can skip this step.
          </p>
        </div>
      )}
    </div>
  )

  // Step 2: View Budget Performance
  const step2Content = (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Budget Performance Summary</h3>
      <p className="text-sm text-muted-foreground">
        Review how your actual spending compared to your budget this period.
      </p>

      {/* Income Section */}
      <div className="border border-border p-4 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <ArrowUpRight size={16} className="text-green-600" />
            <span className="text-sm font-medium">Income</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-green-600 tabular-nums">
              {formatCurrency(totalActualIncome)}
            </span>
            <span className="text-sm text-muted-foreground">
              / {formatCurrency(totalExpectedIncome)}
            </span>
          </div>
        </div>
        <div
          className={cn(
            'text-xs font-medium px-2 py-1 inline-block rounded border',
            incomeVariance >= 0
              ? 'bg-green-50 text-green-700 border-green-600'
              : 'bg-red-50 text-red-700 border-red-600'
          )}
        >
          {incomeVariance >= 0 ? '+' : ''}
          {formatCurrency(incomeVariance)} variance
        </div>
      </div>

      {/* Expenses Section */}
      <div className="border border-border p-4 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <ArrowDownRight size={16} className="text-red-600" />
            <span className="text-sm font-medium">Expenses</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-red-600 tabular-nums">
              {formatCurrency(totalActualExpenses)}
            </span>
            <span className="text-sm text-muted-foreground">
              / {formatCurrency(totalBudgetedExpenses)}
            </span>
          </div>
        </div>
        <div
          className={cn(
            'text-xs font-medium px-2 py-1 inline-block rounded border',
            expenseVariance <= 0
              ? 'bg-green-50 text-green-700 border-green-600'
              : 'bg-red-50 text-red-700 border-red-600'
          )}
        >
          {expenseVariance <= 0 ? '' : '+'}
          {formatCurrency(expenseVariance)} variance
        </div>
      </div>

      {/* Balance Reconciliation */}
      {actualBalance && checkingAccount && (
        <div className="border border-border p-4 bg-muted/30 rounded-lg">
          <h4 className="text-sm font-semibold mb-3">Balance Reconciliation</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Expected Ending Balance</span>
              <span className="font-semibold tabular-nums">
                {formatCurrency(expectedEndingBalance)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Actual Ending Balance</span>
              <span className="font-semibold tabular-nums">
                {formatCurrency(rawBalance)}
              </span>
            </div>
            <div
              className={cn(
                'flex justify-between pt-2 border-t',
                reconciliationVariance >= 0 ? 'text-green-700' : 'text-red-700'
              )}
            >
              <span className="font-semibold">Variance</span>
              <span className="font-bold tabular-nums">
                {reconciliationVariance >= 0 ? '+' : ''}
                {formatCurrency(reconciliationVariance)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )

  // Step 3: Select New Month & Start Period
  const step3Content = (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Select New Budget Period</h3>
      <p className="text-sm text-muted-foreground">
        Choose the month and year for your next budget period.
      </p>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="month">Month</Label>
          <Select
            value={selectedMonth.toString()}
            onValueChange={(val) => setSelectedMonth(parseInt(val))}
          >
            <SelectTrigger id="month">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MONTHS.map((month, idx) => (
                <SelectItem key={idx} value={(idx + 1).toString()}>
                  {month}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="year">Year</Label>
          <Select
            value={selectedYear.toString()}
            onValueChange={(val) => setSelectedYear(parseInt(val))}
          >
            <SelectTrigger id="year">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {YEARS.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {error && (
        <div className="p-3 border border-red-600 bg-red-50 text-red-800 rounded-lg">
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      <Button
        onClick={handleStartNewPeriod}
        disabled={isSubmitting || !selectedMonth || !selectedYear}
        className="w-full"
      >
        {isSubmitting ? 'Starting Period...' : 'Start New Period'}
      </Button>
    </div>
  )

  const steps: WizardStep[] = [
    {
      id: 'update-balance',
      title: 'Update Balance',
      description: 'Enter actual balance',
      icon: <Wallet size={14} />,
      content: step1Content,
    },
    {
      id: 'budget-performance',
      title: 'Review Performance',
      description: 'See budget summary',
      icon: <TrendingUp size={14} />,
      content: step2Content,
    },
    {
      id: 'select-month',
      title: 'Select Month',
      description: 'Choose new period',
      icon: <CalendarPlus size={14} />,
      content: step3Content,
    },
  ]

  return (
    <Wizard
      isOpen={isOpen}
      onClose={onClose}
      title="Start New Budget Period"
      description="Close the current period and begin tracking a new month"
      steps={steps}
    />
  )
}
