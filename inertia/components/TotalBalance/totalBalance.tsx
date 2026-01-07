import { useMemo, useState } from 'react'
import { Card, CardContent } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

import { useUserHome } from '~/context/UserHomeContext'

import { AreaChart } from '~/components/ui/area-chart'

import { formatCurrency } from '~/services/utils_service'

import './style.css'

export default function TotalBalance() {
  const { bucketBreakdown, totalBalance, totalAllocations, accounts } = useUserHome()
  const [showBarList, setShowBarList] = useState(false)
  /**
   * MEMOS
   */
  const { chartData, unallocated, accountNames } = useMemo(createChartData, [
    bucketBreakdown,
    totalBalance,
  ])

  return (
    <Card
      className="relative"
      style={{ background: 'linear-gradient(to right, #F9FEFD, #9ce0d0)' }}
    >
      <CardContent className="pt-6">
        <div className="flex gap-6">
          <div>
            <p className="text-sm">Your Total Savings</p>
            <p className="text-2xl font-bold mt-1">{formatCurrency(totalBalance)}</p>
            <p className="text-xs mt-1">{formatCurrency(unallocated)} left to allocate</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="bar-list-toggle hidden transition-transform"
            onClick={() => setShowBarList(!showBarList)}
            style={{
              transform: showBarList ? 'rotate(180deg)' : 'rotate(0deg)',
            }}
          >
            <ChevronDown className="h-4 w-4" />
          </Button>
          <div className="bar-list-desktop">
            <AreaChart
              data={chartData}
              index="date"
              valueFormatter={(n: number) => `${formatCurrency(n)}`}
              categories={accountNames}
              height={200}
              showGridLines={true}
              showXAxis={true}
              showYAxis={false}
            />
          </div>
        </div>

        <AnimatePresence>
          {showBarList && (
            <motion.div
              className="barlist-mobile"
              initial={{ opacity: 0, height: 0, y: -10 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -10 }}
              transition={{ duration: 0.25, easeInOut: true }}
            >
              <div className="mt-3">
                <AreaChart
                  data={chartData}
                  index="date"
                  xAxisLabel="Date"
                  valueFormatter={(n: number) => `${formatCurrency(n)}`}
                  categories={accountNames}
                  height={200}
                  showGridLines={true}
                  showXAxis={true}
                  showYAxis={false}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  )

  // region MEMO METHODS
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

    const chartData = Object.keys(data).map((date) => {
      return {
        date,
        ...data[date],
      }
    })
    return {
      chartData,
      allocatedPercentage: (totalAllocations / totalBalance) * 100,
      unallocated,
      accountNames,
    }
  }
  // endregion
}
