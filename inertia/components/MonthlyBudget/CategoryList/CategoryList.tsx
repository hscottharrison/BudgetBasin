import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { useMonthlyBudget } from '~/context/MonthlyBudgetContext'
import { formatCurrency } from '~/services/utils_service'
import { BudgetCategoryDTO } from '~/types/budget'
import { cn } from '~/lib/utils'
import './style.css'

interface CategoryListProps {
  type: 'income' | 'expense'
  title: string
}

export default function CategoryList({ type, title }: CategoryListProps) {
  const { incomeCategories, expenseCategories, getCategoryActual, getCategoryTarget } =
    useMonthlyBudget()

  const categories = type === 'income' ? incomeCategories : expenseCategories
  const colorClass = type === 'income' ? 'income' : 'expense'

  if (categories.length === 0) {
    return (
      <Card className="category-list-card">
        <CardHeader>
          <CardTitle className="text-lg">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No {type} categories yet. Add one to get started.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="category-list-card">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2">
          {categories.map((category) => (
            <CategoryRow
              key={category.id}
              category={category}
              actual={getCategoryActual(category.id)}
              target={getCategoryTarget(category.id)}
              colorClass={colorClass}
            />
          ))}
        </div>
      </CardContent>
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
    <div className="category-row">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium">{category.name}</span>
        <div className="flex items-baseline gap-1">
          <span
            className={cn(
              'text-sm font-bold',
              isOver && colorClass === 'expense' && 'text-red-600'
            )}
          >
            {formatCurrency(actual)}
          </span>
          {target > 0 && (
            <span className="text-xs text-muted-foreground">/ {formatCurrency(target)}</span>
          )}
        </div>
      </div>
      {target > 0 && (
        <div className="category-progress-bar">
          <div
            className={cn('category-progress-fill', colorClass, isOver && 'over')}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  )
}
