import {Flex, Heading} from "@radix-ui/themes";

type TotalBalanceProps = {
  balance: string
}

export default function TotalBalance({ balance }: TotalBalanceProps) {
  return (
    <Flex direction='column' gap='2' align='start' py='4' px='2'>
      <Heading as='h2' size='2'>Your Total Savings</Heading>
      <Heading as='h3' size='7'>{ balance }</Heading>
    </Flex>
  )
}
