import {useEffect, useMemo, useState} from "react";
import {Box, Card, Flex, Text} from "@radix-ui/themes";

import BucketMenu from "~/components/BucketsList/BucketMenu/bucketMenu";
import {ProgressCircle} from "~/components/TremorComponents/ProgressCircle/progressCircle";

import {formatCurrency, sumTransactions} from "~/services/utils_service";

import {BucketDTO} from "#models/bucket";
import {TransactionDTO} from "#models/transaction";

type BucketCardProps = {
  bucket: BucketDTO;
  onDeleteBucket: (bucketId: number) => Promise<void>;
  allocateFunds: (allocation: TransactionDTO) => void;
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

  useEffect(animateProgress, [allocationPercentage]);


  return (
    <Card>
      <Box>
        <Flex align='center' justify='between'>
          <Flex align='center'>
            <Box ml='4'>
              <Text weight='bold' size='2'>{ bucket.name }</Text>
              <br />
              <Text weight='bold' size='4'>{ formattedAllocation }</Text>
              <br />
              <Text size='2'>Goal: { formattedGoal }</Text>
            </Box>
          </Flex>
          <Box>
            <Flex gap='2' align='center'>
              <ProgressCircle value={progress} className='mx-auto' radius={30} variant='success'>
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
  function calculateTransactionsSums(){
    return sumTransactions(bucket.transactions)
  }

  function calculateAllocationPercentage() {
    return (transactionSum / bucket.goalAmount) * 100
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
    setFormattedAllocation(formatCurrency(transactionSum))
    setFormattedGoal(formatCurrency(bucket.goalAmount))
  }
  // endregion

  async function onDeleteConfirm() {
    await onDeleteBucket(bucket.id)
  }
}
