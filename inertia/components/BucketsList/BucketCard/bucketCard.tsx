import { useEffect, useMemo, useState } from 'react'
import { Card, CardContent } from '~/components/ui/card'

import BucketMenu from '~/components/BucketsList/BucketMenu/bucketMenu'
import { ProgressCircle } from '~/components/TremorComponents/ProgressCircle/progressCircle'

import { formatCurrency, sumTransactions } from '~/services/utils_service'

import { BucketDTO } from '#models/bucket'
import { TransactionDTO } from '#models/transaction'

type BucketCardProps = {
  bucket: BucketDTO
  onDeleteBucket: (bucketId: number) => Promise<void>
  allocateFunds: (allocation: TransactionDTO) => void
}

export default function BucketCard({ bucket, onDeleteBucket, allocateFunds }: BucketCardProps) {
  /**
   * STATE
   */
  const [formattedAllocation, setFormattedAllocation] = useState<string>('')
  const [formattedGoal, setFormattedGoal] = useState<string>('')
  const [progress, setProgress] = useState(0)

  /**
   * MEMOS
   */
  const transactionSum = useMemo(calculateTransactionsSums, [bucket])

  const allocationPercentage = useMemo(calculateAllocationPercentage, [transactionSum])

  /**
   * EFFECTS
   */
  useEffect(formatNumbers, [transactionSum])

  useEffect(animateProgress, [allocationPercentage])

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="ml-4">
              <p className="text-sm font-bold">{bucket.name}</p>
              <p className="text-xl font-bold mt-1">{formattedAllocation}</p>
              <p className="text-sm mt-1">Goal: {formattedGoal}</p>
            </div>
          </div>
          <div>
            <div className="flex gap-2 items-center">
              <ProgressCircle value={progress} className="mx-auto" radius={30} variant="success" />
              <BucketMenu
                bucket={bucket}
                onDeleteConfirm={onDeleteConfirm}
                allocateFunds={allocateFunds}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  // region MEMO METHODS
  function calculateTransactionsSums() {
    return sumTransactions(bucket.transactions)
  }

  function calculateAllocationPercentage() {
    return (transactionSum / bucket.goalAmount) * 100
  }
  // endregion

  // region EFFECT METHODS
  function animateProgress() {
    const timer = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= allocationPercentage) {
          clearInterval(timer)
          return allocationPercentage
        }
        return prevProgress + 10
      })
    }, 50) // Update every 500ms

    return () => {
      clearInterval(timer) // Clear interval on component unmount
    }
  }

  function formatNumbers() {
    setFormattedAllocation(formatCurrency(transactionSum))
    setFormattedGoal(formatCurrency(bucket.goalAmount))
  }
  // endregion

  async function onDeleteConfirm() {
    await onDeleteBucket(bucket.id)
  }
}
