import {Card, Flex, Grid, Heading, Text} from "@radix-ui/themes";

type TotalBalanceProps = {
  balance: string
  allocations: string
}

export default function TotalBalance({ allocations, balance }: TotalBalanceProps) {
  return (
    <Grid columns="2" gap={{ initial:'1', sm: '1', md: '3', lg: '3'}}>
      <Card>
        <Flex align='center' justify='between' direction='column'>
          <Heading as='h3' size='3'>{ balance }</Heading>
          <Text size='1'>Your Total Savings</Text>
        </Flex>
      </Card>
      <Card>
        <Flex align='center' justify='between' direction='column'>
          <Heading as='h3' size='3'>{ allocations }</Heading>
          <Text size='1'>Total Funds Allocated</Text>
        </Flex>
      </Card>
    </Grid>
  )
}
