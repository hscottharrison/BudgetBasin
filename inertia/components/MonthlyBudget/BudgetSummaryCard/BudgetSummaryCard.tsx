import { useMonthlyBudget } from '~/context/MonthlyBudgetContext'
import { formatCurrency } from '~/services/utils_service'
import { cn } from '~/lib/utils'
import { Calendar, Wallet, ArrowUpRight, ArrowDownRight } from 'lucide-react'

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
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
    <div className="border border-border bg-card">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-muted-foreground" />
          <h2 className="text-base font-semibold">{periodLabel}</h2>
          {currentPeriod && (
            <span className={cn(
              'px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider border',
              currentPeriod.status === 'active'
                ? 'border-green-600 text-green-600 bg-green-50'
                : 'border-muted-foreground text-muted-foreground'
            )}>
              {currentPeriod.status}
            </span>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-border">
        {/* Income */}
        <div className="p-4">
          <div className="flex items-center gap-1 mb-1">
            <ArrowUpRight size={12} className="text-green-600" />
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Income</p>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-bold text-green-600 tabular-nums">
              {formatCurrency(totalActualIncome)}
            </span>
            <span className="text-xs text-muted-foreground tabular-nums">
              / {formatCurrency(totalExpectedIncome)}
            </span>
          </div>
          <div className="mt-2 h-1 bg-muted overflow-hidden">
            <div
              className="h-full bg-green-600 transition-all duration-300"
              style={{ width: `${Math.min(incomeProgress, 100)}%` }}
            />
          </div>
        </div>

        {/* Expenses */}
        <div className="p-4">
          <div className="flex items-center gap-1 mb-1">
            <ArrowDownRight size={12} className="text-red-600" />
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Spent</p>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-bold text-red-600 tabular-nums">
              {formatCurrency(totalActualExpenses)}
            </span>
            <span className="text-xs text-muted-foreground tabular-nums">
              / {formatCurrency(totalBudgetedExpenses)}
            </span>
          </div>
          <div className="mt-2 h-1 bg-muted overflow-hidden">
            <div
              className={cn(
                "h-full transition-all duration-300",
                expenseProgress > 100 ? "bg-red-600" : "bg-primary"
              )}
              style={{ width: `${Math.min(expenseProgress, 100)}%` }}
            />
          </div>
        </div>

        {/* Remaining */}
        <div className="p-4">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-1">Remaining</p>
          <span
            className={cn(
              'text-lg font-bold tabular-nums',
              remainingBudget >= 0 ? 'text-green-600' : 'text-red-600'
            )}
          >
            {formatCurrency(remainingBudget)}
          </span>
        </div>

        {/* Checking Balance */}
        {checkingAccount ? (
          <div className="p-4">
            <div className="flex items-center gap-1 mb-1">
              <Wallet size={12} className="text-muted-foreground" />
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Checking</p>
            </div>
            <span
              className={cn(
                'text-lg font-bold tabular-nums',
                checkingBalance >= 0 ? 'text-foreground' : 'text-red-600'
              )}
            >
              {formatCurrency(checkingBalance)}
            </span>
          </div>
        ) : (
          <div className="p-4">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-1">Net</p>
            <span className={cn(
              'text-lg font-bold tabular-nums',
              (totalActualIncome - totalActualExpenses) >= 0 ? 'text-foreground' : 'text-red-600'
            )}>
              {formatCurrency(totalActualIncome - totalActualExpenses)}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
