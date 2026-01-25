import { ExternalLink, PiggyBank, Target, Wallet } from 'lucide-react'
import { formatBudgetMonth, formatCurrency } from '~/services/utils_service'
import { useUserHome } from '~/context/UserHomeContext'

export default function DashboardStats() {
  const { currentPeriod, totalSavings, totalChecking, totalActualExpenses, totalPlannedExpenses } = useUserHome()

  return (
    <div className="border border-border bg-card">
      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-border">
        {/* Total Savings */}
        <div className="p-4">
          <div className="flex items-center gap-1 mb-1">
            <Wallet size={12} className="text-muted-foreground" />
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Total Savings</p>
          </div>
          <span className="text-lg font-bold tabular-nums">{formatCurrency(totalSavings)}</span>
        </div>

        {/* Total Savings */}
        <div className="p-4">
          <div className="flex items-center gap-1 mb-1">
            <Wallet size={12} className="text-muted-foreground" />
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Total Checking</p>
          </div>
          <span className="text-lg font-bold tabular-nums">{formatCurrency(totalChecking)}</span>
        </div>

        {/* Unallocated */}
        <div className="p-4">
          <div className="flex items-center gap-1 mb-1">
            <Target size={12} className="text-muted-foreground" />
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Current Budget</p>
            <a href={`/monthly-budget/${currentPeriod?.id ?? ''}`} className={`ml-auto`}>
              <ExternalLink size={12} className="ml-1 text-muted-foreground" />
            </a>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-bold tabular-nums">
              {formatCurrency(totalActualExpenses)}
            </span>
            <span className="text-xs text-muted-foreground tabular-nums">
              / {formatCurrency(totalPlannedExpenses)}
            </span>
          </div>
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">{formatBudgetMonth(currentPeriod?.month, currentPeriod?.year)}</p>
        </div>

        {/* Accounts */}
        <div className="p-4">
          <div className="flex items-center gap-1 mb-1">
            <PiggyBank size={12} className="text-muted-foreground" />
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Unallocated</p>
          </div>
          <span className="text-lg font-bold tabular-nums">NEW VALUE HERE</span>
        </div>
      </div>
    </div>
  )
}
