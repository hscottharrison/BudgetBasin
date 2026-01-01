import { Box, Card, Flex, Text, Badge } from '@radix-ui/themes'
import { useMonthlyBudget } from '~/context/MonthlyBudgetContext'
import { formatCurrency } from '~/services/utils_service'
import './style.css'

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

export default function BudgetSummaryCard() {
  const {
    currentPeriod,
    totalExpectedIncome,
    totalBudgetedExpenses,
    totalActualIncome,
    totalActualExpenses,
    remainingBudget,
  } = useMonthlyBudget()

  const periodLabel = currentPeriod
    ? `${MONTH_NAMES[currentPeriod.month - 1]} ${currentPeriod.year}`
    : 'No Active Period'

  const incomeProgress = totalExpectedIncome > 0
    ? Math.round((totalActualIncome / totalExpectedIncome) * 100)
    : 0

  const expenseProgress = totalBudgetedExpenses > 0
    ? Math.round((totalActualExpenses / totalBudgetedExpenses) * 100)
    : 0

  return (
    <Card className="budget-summary-card">
      <Flex justify="between" align="start" wrap="wrap" gap="4">
        {/* Period Header */}
        <Box>
          <Flex align="center" gap="2" mb="1">
            <Text size="4" weight="bold">{periodLabel}</Text>
            {currentPeriod && (
              <Badge color={currentPeriod.status === 'active' ? 'green' : 'gray'}>
                {currentPeriod.status}
              </Badge>
            )}
          </Flex>
          <Text size="2" color="gray">Your monthly budget overview</Text>
        </Box>

        {/* Summary Stats */}
        <Flex gap="6" wrap="wrap">
          {/* Income */}
          <Box className="budget-stat">
            <Text size="1" color="gray">Income</Text>
            <Flex align="baseline" gap="1">
              <Text size="3" weight="bold" color="green">
                {formatCurrency(totalActualIncome)}
              </Text>
              <Text size="1" color="gray">
                / {formatCurrency(totalExpectedIncome)}
              </Text>
            </Flex>
            <Box className="budget-progress-bar">
              <Box
                className="budget-progress-fill income"
                style={{ width: `${Math.min(incomeProgress, 100)}%` }}
              />
            </Box>
          </Box>

          {/* Expenses */}
          <Box className="budget-stat">
            <Text size="1" color="gray">Expenses</Text>
            <Flex align="baseline" gap="1">
              <Text size="3" weight="bold" color="red">
                {formatCurrency(totalActualExpenses)}
              </Text>
              <Text size="1" color="gray">
                / {formatCurrency(totalBudgetedExpenses)}
              </Text>
            </Flex>
            <Box className="budget-progress-bar">
              <Box
                className="budget-progress-fill expense"
                style={{ width: `${Math.min(expenseProgress, 100)}%` }}
              />
            </Box>
          </Box>

          {/* Remaining */}
          <Box className="budget-stat">
            <Text size="1" color="gray">Remaining</Text>
            <Text
              size="3"
              weight="bold"
              color={remainingBudget >= 0 ? 'green' : 'red'}
            >
              {formatCurrency(remainingBudget)}
            </Text>
          </Box>
        </Flex>
      </Flex>
    </Card>
  )
}



