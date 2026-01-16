import { useEffect, useMemo, useState } from 'react'

import BucketMenu from '~/components/BucketsList/BucketMenu/bucketMenu'
import { formatCurrency, sumTransactions } from '~/services/utils_service'
import { cn } from '~/lib/utils'

import { BucketDTO } from '#models/bucket'
import { TransactionDTO } from '#models/transaction'

type BucketCardProps = {
  bucket: BucketDTO
  onDeleteBucket: (bucketId: number) => Promise<void>
  allocateFunds: (allocation: TransactionDTO) => void
}

export default function BucketCard({ bucket, onDeleteBucket, allocateFunds }: BucketCardProps) {
  const [progress, setProgress] = useState(0)

  const transactionSum = useMemo(() => sumTransactions(bucket.transactions), [bucket])
  const allocationPercentage = useMemo(
    () => bucket.goalAmount > 0 ? (transactionSum / bucket.goalAmount) * 100 : 0,
    [transactionSum, bucket.goalAmount]
  )
  const isComplete = allocationPercentage >= 100

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= allocationPercentage) {
          clearInterval(timer)
          return allocationPercentage
        }
        return prev + 10
      })
    }, 50)
    return () => clearInterval(timer)
  }, [allocationPercentage])

  return (
    <div className="border border-border bg-background p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold truncate">{bucket.name}</p>
          <div className="flex items-baseline gap-1 mt-1">
            <span className={cn(
              "text-lg font-bold tabular-nums",
              isComplete && "text-green-600"
            )}>
              {formatCurrency(transactionSum)}
            </span>
            <span className="text-xs text-muted-foreground tabular-nums">
              / {formatCurrency(bucket.goalAmount)}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="text-right">
            <span className={cn(
              "text-sm font-bold tabular-nums",
              isComplete ? "text-green-600" : "text-muted-foreground"
            )}>
              {Math.min(Math.round(progress), 100)}%
            </span>
          </div>
          <BucketMenu
            bucket={bucket}
            onDeleteConfirm={onDeleteConfirm}
            allocateFunds={allocateFunds}
          />
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-3 h-1 bg-muted overflow-hidden">
        <div
          className={cn(
            "h-full transition-all duration-300",
            isComplete ? "bg-green-600" : "bg-primary"
          )}
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>
    </div>
  )

  async function onDeleteConfirm() {
    await onDeleteBucket(bucket.id)
  }
}
