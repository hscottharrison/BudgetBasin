import BucketCard from '~/components/BucketsList/BucketCard/bucketCard'

import { deleteBucket } from '~/services/bucket_service'

import { BucketDTO } from '#models/bucket'
import { useUserHome } from '~/context/UserHomeContext'
import { TransactionDTO } from '#models/transaction'

export default function BucketsList() {
  const { buckets, updateBuckets, updateTransactionsForBucket } = useUserHome()
  return (
    <div className="overflow-y-auto h-full pr-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-auto">
        {buckets.map((bucket: BucketDTO) => (
          <BucketCard
            key={bucket.id}
            bucket={bucket}
            allocateFunds={allocateFunds}
            onDeleteBucket={onDeleteBucket}
          />
        ))}
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
