import { Target } from 'lucide-react'
import BucketCard from '~/components/BucketsList/BucketCard/bucketCard'
import { deleteBucket } from '~/services/bucket_service'
import { BucketDTO } from '#models/bucket'
import { useUserHome } from '~/context/SavingsContext'
import { TransactionDTO } from '#models/transaction'

export default function BucketsList() {
  const { buckets, updateBuckets, updateTransactionsForBucket } = useUserHome()

  return (
    <div className="border border-border bg-card h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border flex-shrink-0">
        <Target size={16} className="text-green-600" />
        <h3 className="text-sm font-semibold uppercase tracking-wide">Savings Goals</h3>
        <span className="text-xs text-muted-foreground ml-auto">
          {buckets.length} {buckets.length === 1 ? 'bucket' : 'buckets'}
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {buckets.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm text-muted-foreground">No savings buckets yet</p>
            <p className="text-xs text-muted-foreground mt-1">Create one to start tracking your goals</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {buckets.map((bucket: BucketDTO) => (
              <BucketCard
                key={bucket.id}
                bucket={bucket}
                allocateFunds={allocateFunds}
                onDeleteBucket={onDeleteBucket}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )

  async function onDeleteBucket(bucketId: number) {
    const buckets = await deleteBucket(bucketId)
    updateBuckets(buckets)
  }

  function allocateFunds(transaction: TransactionDTO) {
    updateTransactionsForBucket(transaction)
  }
}
