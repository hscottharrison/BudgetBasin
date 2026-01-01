import { Box, Card, Flex, Grid, Text, Heading } from '@radix-ui/themes'
import { useMonthlyBudget } from '~/context/MonthlyBudgetContext'
import { formatCurrency } from '~/services/utils_service'
import { BudgetCategoryDTO } from '~/types/budget'
import './style.css'

interface CategoryListProps {
  type: 'income' | 'expense'
  title: string
}

export default function CategoryList({ type, title }: CategoryListProps) {
  const {
    incomeCategories,
    expenseCategories,
    getCategoryActual,
    getCategoryTarget,
  } = useMonthlyBudget()

  const categories = type === 'income' ? incomeCategories : expenseCategories
  const colorClass = type === 'income' ? 'income' : 'expense'

  if (categories.length === 0) {
    return (
      <Card className="category-list-card">
        <Heading size="3" mb="3">{title}</Heading>
        <Text size="2" color="gray">
          No {type} categories yet. Add one to get started.
        </Text>
      </Card>
    )
  }

  return (
    <Card className="category-list-card">
      <Heading size="3" mb="3">{title}</Heading>
      <Grid gap="2">
        {categories.map((category) => (
          <CategoryRow
            key={category.id}
            category={category}
            actual={getCategoryActual(category.id)}
            target={getCategoryTarget(category.id)}
            colorClass={colorClass}
          />
        ))}
      </Grid>
    </Card>
  )
}

interface CategoryRowProps {
  category: BudgetCategoryDTO
  actual: number
  target: number
  colorClass: string
}

function CategoryRow({ category, actual, target, colorClass }: CategoryRowProps) {
  const progress = target > 0 ? Math.min((actual / target) * 100, 100) : 0
  const isOver = actual > target && target > 0

  return (
    <Box className="category-row">
      <Flex justify="between" align="center" mb="1">
        <Text size="2" weight="medium">{category.name}</Text>
        <Flex align="baseline" gap="1">
          <Text size="2" weight="bold" color={isOver && colorClass === 'expense' ? 'red' : undefined}>
            {formatCurrency(actual)}
          </Text>
          {target > 0 && (
            <Text size="1" color="gray">
              / {formatCurrency(target)}
            </Text>
          )}
        </Flex>
      </Flex>
      {target > 0 && (
        <Box className="category-progress-bar">
          <Box
            className={`category-progress-fill ${colorClass} ${isOver ? 'over' : ''}`}
            style={{ width: `${progress}%` }}
          />
        </Box>
      )}
    </Box>
  )
}



