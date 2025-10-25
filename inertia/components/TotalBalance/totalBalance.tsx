import { useMemo, useState } from 'react'
import { Box, Card, ChevronDownIcon, Grid, IconButton, Text } from '@radix-ui/themes'
import { motion, AnimatePresence } from "framer-motion";

import {useUserHome} from "~/context/UserHomeContext";

import { BarList } from '~/components/TremorComponents/BarList/barList'

import { formatCurrency } from "~/services/utils_service";

import './style.css';

export default function TotalBalance() {
  const { bucketBreakdown, totalBalance, totalAllocations } = useUserHome();
  const [showBarList, setShowBarList] = useState(false);
  /**
   * MEMOS
   */
  const { chartData, unallocated } = useMemo(createChartData, [bucketBreakdown, totalBalance]);

  return (
      <Card variant='ghost' style={{ position: 'relative', padding: '1rem 2rem',background: 'linear-gradient(to right, #F9FEFD, #9ce0d0)'}}>
        <Grid gap="4" columns={{ sm: "1", md: "2", lg: "2" }}>
          <Box>
            <Text size='2'>Your Total Savings</Text>
            <br />
            <Text size='4' weight='bold'>{formatCurrency(totalBalance)}</Text>
            <br />
            <Text size='1'>{formatCurrency(unallocated)} left to allocate</Text>
          </Box>
          <IconButton
            variant='ghost'
            className='bar-list-toggle'
            size='2'
            onClick={() => setShowBarList(!showBarList)}
            style={{
              display: 'none',
              transition: 'transform 0.3s ease',
              transform: showBarList ? 'rotate(180deg)' : 'rotate(0deg)',}}>
            <ChevronDownIcon />
          </IconButton>
          <Box className='bar-list-desktop'>
            <BarList
              data={chartData}
              valueFormatter={(number: number) => `${formatCurrency(number)}`} />
          </Box>
        </Grid>

        <AnimatePresence>
          {showBarList && (
            <motion.div
              className="barlist-mobile"
              initial={{ opacity: 0, height: 0, y: -10 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, y: -10 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
            >
              <Box mt="3">
                <BarList
                  data={chartData}
                  valueFormatter={(n: number) => `${formatCurrency(n)}`}
                />
              </Box>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
  )

  // region MEMO METHODS
  function createChartData() {
    const unallocated = totalBalance - totalAllocations;
    const pageStats = {
      chartData: [
        ...bucketBreakdown,
        {
          name: 'Unallocated',
          value: unallocated
        }
      ],
      allocatedPercentage: totalAllocations / totalBalance * 100,
      unallocated,
    }
    return pageStats
  }
  // endregion
}
