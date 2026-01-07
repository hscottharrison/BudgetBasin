import { Card, CardContent } from '~/components/ui/card'
import { useMonthlyBudget } from '~/context/MonthlyBudgetContext'
import { formatCurrency } from '~/services/utils_service'
import { cn } from '~/lib/utils'
import './style.css'

const MONTH_NAMES = [
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

export default function BudgetSummaryCard() {
  const {
    currentPeriod,
    totalExpectedIncome,
    totalBudgetedExpenses,
    totalActualIncome,
    totalActualExpenses,
    remainingBudget,
    checkingBalance,
    checkingAccount,
  } = useMonthlyBudget()

  const periodLabel = currentPeriod
    ? `${MONTH_NAMES[currentPeriod.month - 1]} ${currentPeriod.year}`
    : 'No Active Period'

  const incomeProgress =
    totalExpectedIncome > 0 ? Math.round((totalActualIncome / totalExpectedIncome) * 100) : 0

  const expenseProgress =
    totalBudgetedExpenses > 0
      ? Math.round((totalActualExpenses / totalBudgetedExpenses) * 100)
      : 0

  return (
    <Card className="budget-summary-card">
      <CardContent className="pt-6">
        <div className="flex justify-between items-start flex-wrap gap-4">
          {/* Period Header */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-2xl font-bold">{periodLabel}</h2>
              {currentPeriod && (
                <span
                  className={cn(
                    'px-2 py-1 rounded-full text-xs font-medium',
                    currentPeriod.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  )}
                >
                  {currentPeriod.status}
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground">Your monthly budget overview</p>
          </div>

          {/* Summary Stats */}
          <div className="flex gap-6 flex-wrap">
            {/* Income */}
            <div className="budget-stat">
              <p className="text-xs text-muted-foreground">Income</p>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-bold text-green-600">
                  {formatCurrency(totalActualIncome)}
                </span>
                <span className="text-xs text-muted-foreground">
                  / {formatCurrency(totalExpectedIncome)}
                </span>
              </div>
              <div className="budget-progress-bar">
                <div
                  className="budget-progress-fill income"
                  style={{ width: `${Math.min(incomeProgress, 100)}%` }}
                />
              </div>
            </div>

            {/* Expenses */}
            <div className="budget-stat">
              <p className="text-xs text-muted-foreground">Expenses</p>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-bold text-red-600">
                  {formatCurrency(totalActualExpenses)}
                </span>
                <span className="text-xs text-muted-foreground">
                  / {formatCurrency(totalBudgetedExpenses)}
                </span>
              </div>
              <div className="budget-progress-bar">
                <div
                  className="budget-progress-fill expense"
                  style={{ width: `${Math.min(expenseProgress, 100)}%` }}
                />
              </div>
            </div>

            {/* Remaining */}
            <div className="budget-stat">
              <p className="text-xs text-muted-foreground">Remaining</p>
              <span
                className={cn(
                  'text-lg font-bold',
                  remainingBudget >= 0 ? 'text-green-600' : 'text-red-600'
                )}
              >
                {formatCurrency(remainingBudget)}
              </span>
            </div>

            {/* Checking Account Balance */}
            {checkingAccount && (
              <div className="budget-stat checking-balance">
                <p className="text-xs text-muted-foreground">Checking Balance</p>
                <span
                  className={cn(
                    'text-lg font-bold',
                    checkingBalance >= 0 ? 'text-blue-600' : 'text-red-600'
                  )}
                >
                  {formatCurrency(checkingBalance)}
                </span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
