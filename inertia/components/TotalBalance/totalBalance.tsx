import { useMemo, useState } from 'react'
import { Button } from '~/components/ui/button'
import { ChevronDown, Wallet, PiggyBank, Target } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

import { useUserHome } from '~/context/UserHomeContext'
import { AreaChart } from '~/components/ui/area-chart'
import { formatCurrency } from '~/services/utils_service'
import { cn } from '~/lib/utils'

export default function TotalBalance() {
  const { bucketBreakdown, totalBalance, totalAllocations, accounts } = useUserHome()
  const [showChart, setShowChart] = useState(false)

  const { chartData, unallocated, accountNames } = useMemo(createChartData, [
    bucketBreakdown,
    totalBalance,
    accounts,
    totalAllocations,
  ])

  const allocationPercent = totalBalance > 0 ? Math.round((totalAllocations / totalBalance) * 100) : 0

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
          <span className="text-lg font-bold tabular-nums">{formatCurrency(totalBalance)}</span>
        </div>

        {/* Allocated */}
        <div className="p-4">
          <div className="flex items-center gap-1 mb-1">
            <Target size={12} className="text-green-600" />
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Allocated</p>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-bold text-green-600 tabular-nums">{formatCurrency(totalAllocations)}</span>
            <span className="text-xs text-muted-foreground">{allocationPercent}%</span>
          </div>
          <div className="mt-2 h-1 bg-muted overflow-hidden">
            <div
              className="h-full bg-green-600 transition-all duration-300"
              style={{ width: `${allocationPercent}%` }}
            />
          </div>
        </div>

        {/* Unallocated */}
        <div className="p-4">
          <div className="flex items-center gap-1 mb-1">
            <PiggyBank size={12} className="text-muted-foreground" />
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Unallocated</p>
          </div>
          <span className={cn(
            "text-lg font-bold tabular-nums",
            unallocated < 0 && "text-red-600"
          )}>
            {formatCurrency(unallocated)}
          </span>
        </div>

        {/* Accounts */}
        <div className="p-4">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-1">Accounts</p>
          <span className="text-lg font-bold tabular-nums">{accounts.length}</span>
        </div>
      </div>

      {/* Chart Toggle - Mobile */}
      <div className="md:hidden border-t border-border">
        <Button
          variant="ghost"
          className="w-full h-10 flex items-center justify-center gap-2 text-xs"
          onClick={() => setShowChart(!showChart)}
        >
          <span>Balance History</span>
          <ChevronDown className={cn(
            "h-4 w-4 transition-transform",
            showChart && "rotate-180"
          )} />
        </Button>
      </div>

      {/* Chart - Mobile (Collapsible) */}
      <AnimatePresence>
        {showChart && (
          <motion.div
            className="md:hidden border-t border-border"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="p-4">
              <AreaChart
                data={chartData}
                index="date"
                valueFormatter={(n: number) => formatCurrency(n)}
                categories={accountNames}
                height={180}
                showGridLines={true}
                showXAxis={true}
                showYAxis={false}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chart - Desktop (Always visible) */}
      {chartData.length > 0 && (
        <div className="hidden md:block border-t border-border p-4">
          <AreaChart
            data={chartData}
            index="date"
            valueFormatter={(n: number) => formatCurrency(n)}
            categories={accountNames}
            height={180}
            showGridLines={true}
            showXAxis={true}
            showYAxis={false}
          />
        </div>
      )}
    </div>
  )

  function createChartData() {
    const unallocated = totalBalance - totalAllocations
    const accountNames: string[] = []
    const data: Record<string, Record<string, string>> = accounts.reduce(
      (balanceHistoryMap: Record<string, Record<string, string>>, account) => {
        accountNames.push(account.name)
        account.balances.forEach((balance) => {
          const formattedDate = new Date(balance.createdAt ?? '').toLocaleDateString('en-US')
          if (!balanceHistoryMap[formattedDate]) {
            balanceHistoryMap[formattedDate] = {}
          }
          balanceHistoryMap[formattedDate][account.name] = balance.amount.toString()
        })
        return balanceHistoryMap
      },
      {}
    )

    const chartData = Object.keys(data).map((date) => ({
      date,
      ...data[date],
    }))

    return {
      chartData,
      allocatedPercentage: (totalAllocations / totalBalance) * 100,
      unallocated,
      accountNames,
    }
  }
}
