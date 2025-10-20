import {useMemo} from "react";
import {Card, Flex, Text} from "@radix-ui/themes";

import {DonutChart} from "~/components/TremorComponents/DonutChart/donutChart";

import { formatCurrency } from "~/services/utils_service";

import './style.css';
import {useUserHome} from "~/context/UserHomeContext";

export default function TotalBalance() {
  const { bucketBreakdown, totalBalance, totalAllocations } = useUserHome();
  /**
   * MEMOS
   */
  const chartData = useMemo(createChartData, [bucketBreakdown, totalBalance]);

  return (
      <Card variant='classic'>
        <Flex direction='column' align='center' justify='center' gap='4'>
          <DonutChart
            className='mx-auto donut-chart-class'
            data={chartData}
            category='name'
            value="amount"
            showLabel={true}
            valueFormatter={(number: number) => `${formatCurrency(number)}`} />
          <Text size='2' weight='bold'>Your Total Savings</Text>
        </Flex>
      </Card>
  )

  // region MEMO METHODS
  function createChartData() {
    debugger;
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
