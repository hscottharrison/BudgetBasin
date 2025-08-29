import {Grid, ScrollArea} from "@radix-ui/themes";

import BucketCard from "~/components/BucketsList/BucketCard/bucketCard";

import {deleteBucket} from "~/services/bucket_service";

import {BucketDTO} from "#models/bucket";

type BucketsListProps = {
  buckets: BucketDTO[];
  updateBuckets: (buckets: BucketDTO[]) => void
}
export default function BucketsList({ buckets, updateBuckets }: BucketsListProps){
  return (
    <ScrollArea scrollbars='vertical' type='auto' style={{ height: '100%', paddingRight: '1rem' }}>
      <Grid columns={{ xs: '1', sm: '3', md: '3', lg: '3'}} gap='3' width='auto'>
        {buckets.map((bucket: BucketDTO) => (
          <BucketCard
            key={bucket.id}
            bucket={bucket}
            onDeleteBucket={onDeleteBucket}/>
        ))}
      </Grid>
    </ScrollArea>
  )

  async function onDeleteBucket(bucketId: number){
    const buckets = await deleteBucket(bucketId)
    updateBuckets(buckets)
  }
}
