import {BucketDTO} from "#models/bucket";
import {Box, Card, Flex, Grid, ScrollArea, Text} from "@radix-ui/themes";
import { RiWalletFill } from "@remixicon/react"
import {sumAllocations} from "~/services/utils_service";

type BucketsListProps = {
  buckets: BucketDTO[];
}
export default function BucketsList({ buckets }: BucketsListProps){
  return (
    <ScrollArea>
      <Grid columns={{ sm: '1', md: '3', lg: '3'}} gap='3' width='auto'>
        {buckets.map((bucket: BucketDTO) => (
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
                  <Text weight='bold' size='3'>{ sumAllocations(bucket.allocations) }</Text>
                  /
                  <Text size='2'>{ bucket.goalAmount }</Text>
                </Box>
              </Flex>
            </Box>
          </Card>
        ))}
      </Grid>
    </ScrollArea>
  )
}
