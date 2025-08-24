import {useMemo} from "react";
import {Card, Flex, Text} from "@radix-ui/themes";

import {DonutChart} from "~/components/TremorComponents/DonutChart/donutChart";

import { formatCurrency } from "~/services/utils_service";

type TotalBalanceProps = {
  totalBalance: number
  totalAllocations: number
  bucketBreakdown: {name: string, amount: number}[]
}

export default function TotalBalance({ totalBalance, bucketBreakdown, totalAllocations }: TotalBalanceProps) {
  /**
   * MEMOS
   */
  const chartData = useMemo(createChartData, [bucketBreakdown, totalBalance]);

  return (
      <Card variant='classic'>
        <Flex direction='column' align='center' justify='center' gap='4'>
          <DonutChart
            className='mx-auto'
            data={chartData}
            category='name'
            value="amount"
            showLabel={true}
            valueFormatter={(number: number) => `${formatCurrency(number)}`} />
          <Text size='3' weight='bold'>Your Total Savings</Text>
        </Flex>
      </Card>
  )

  // region MEMO METHODS
  function createChartData() {
    const unallocated = totalBalance - totalAllocations;
    return [
      ...bucketBreakdown,
      {
        name: 'Unallocated',
        amount: unallocated
      }
    ]
  }
  // endregion
}
