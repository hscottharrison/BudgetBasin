import {useEffect, useMemo, useState} from "react";
import {Box, Card, Flex, Text} from "@radix-ui/themes";
import {RiWalletFill} from "@remixicon/react";

import BucketMenu from "~/components/BucketsList/BucketMenu/bucketMenu";
import {ProgressCircle} from "~/components/TremorComponents/ProgressCircle/progressCircle";

import {formatCurrency, sumAllocations} from "~/services/utils_service";

import {BucketDTO} from "#models/bucket";
import {AllocationDTO} from "#models/allocation";

type BucketCardProps = {
  bucket: BucketDTO;
  onDeleteBucket: (bucketId: number) => Promise<void>;
  allocateFunds: (allocation: AllocationDTO) => void;
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
  const allocationSum = useMemo(calculateAllocationSums, [bucket])

  const allocationPercentage = useMemo(calculateAllocationPercentage, [allocationSum])

  /**
   * EFFECTS
   */
  useEffect(formatNumbers, [allocationSum])

  useEffect(animateProgress, [allocationPercentage]);


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
              <ProgressCircle value={progress} className='mx-auto' radius={60} variant='success'>
                <Flex justify='center' align='center' wrap='wrap' p='2'>
                  <Text weight='bold' size='3'>{ formattedAllocation }</Text>
                  /
                  <Text size='2'>{ formattedGoal }</Text>
                </Flex>
              </ProgressCircle>
              <BucketMenu
                bucket={bucket}
                onDeleteConfirm={onDeleteConfirm}
                allocateFunds={allocateFunds}/>
            </Flex>
          </Box>
        </Flex>
      </Box>
    </Card>
  )

  // region MEMO METHODS
  function calculateAllocationSums(){
    return sumAllocations(bucket.allocations)
  }

  function calculateAllocationPercentage() {
    return (allocationSum / bucket.goalAmount) * 100
  }
  // endregion

  // region EFFECT METHODS
  function animateProgress(){
    const timer = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= allocationPercentage) {
          clearInterval(timer);
          return allocationPercentage;
        }
        return prevProgress + 10;
      });
    }, 50); // Update every 500ms

    return () => {
      clearInterval(timer); // Clear interval on component unmount
    };
  }

  function formatNumbers() {
    setFormattedAllocation(formatCurrency(allocationSum))
    setFormattedGoal(formatCurrency(bucket.goalAmount))
  }
  // endregion

  async function onDeleteConfirm() {
    await onDeleteBucket(bucket.id)
  }
}
