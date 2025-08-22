import {Box, Card, Flex, Text} from "@radix-ui/themes";
import {RiWalletFill} from "@remixicon/react";
import {formatCurrency, sumAllocations} from "~/services/utils_service";
import {BucketDTO} from "#models/bucket";
import BucketMenu from "~/components/BucketsList/BucketMenu/bucketMenu";
import {useEffect, useMemo, useState} from "react";
import {ProgressCircle} from "~/components/TremorComponents/ProgressCircle/progressCircle";

type BucketCardProps = {
  bucket: BucketDTO;
  onDeleteBucket: (bucketId: number) => Promise<void>;
}

export default function BucketCard({ bucket, onDeleteBucket }: BucketCardProps) {
  const [formattedAllocation, setFormattedAllocation] = useState<string>('')
  const [formattedGoal, setFormattedGoal] = useState<string>('')

  const allocationSum = useMemo(() => {
    return sumAllocations(bucket.allocations)
  }, [bucket])

  const allocationPercentage = useMemo(() => {
    return (allocationSum / bucket.goalAmount) * 100
  }, [allocationSum])

  useEffect(() => {
    setFormattedAllocation(formatCurrency(allocationSum))
    setFormattedGoal(formatCurrency(bucket.goalAmount))
  }, [allocationSum])

  return (
    <Card>
      <Box>
        <Flex align='center' justify='between'>
          <Flex align='center'>
            <RiWalletFill />
            <Box ml='4'>
              <Text weight='bold' size='3'>{ bucket.name }</Text>
              <br />
              <Text size='1'> { bucket.description }</Text>
            </Box>
          </Flex>
          <Box>
            <Flex gap='2' align='center'>
              <ProgressCircle value={allocationPercentage} className='mx-auto' radius={60} variant='success'>
                <Flex justify='center' align='center' wrap='wrap' p='2'>
                  <Text weight='bold' size='3'>{ formattedAllocation }</Text>
                  /
                  <Text size='2'>{ formattedGoal }</Text>
                </Flex>
              </ProgressCircle>
              <BucketMenu
                bucket={bucket}
                onDeleteConfirm={onDeleteConfirm}/>
            </Flex>
          </Box>
        </Flex>
      </Box>
    </Card>
  )

  async function onDeleteConfirm() {
    await onDeleteBucket(bucket.id)
  }
}
