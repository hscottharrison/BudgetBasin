import { useMonthlyBudget } from '~/context/MonthlyBudgetContext'
import { formatCurrency } from '~/services/utils_service'
import { BudgetCategoryDTO } from '~/types/budget'
import { cn } from '~/lib/utils'

interface CategoryListProps {
  type: 'income' | 'expense'
  title: string
  icon?: React.ReactNode
  compact?: boolean
  scrollable?: boolean
}

export default function CategoryList({ 
  type, 
  title, 
  icon,
  compact = false,
  scrollable = false 
}: CategoryListProps) {
  const { incomeCategories, expenseCategories, getCategoryActual, getCategoryTarget } =
    useMonthlyBudget()

  const categories = type === 'income' ? incomeCategories : expenseCategories
  const colorClass = type === 'income' ? 'income' : 'expense'

  if (categories.length === 0) {
    return (
      <div className={cn(
        "border border-border bg-card h-full flex flex-col",
        scrollable && "overflow-hidden"
      )}>
        <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
          {icon}
          <h3 className="text-sm font-semibold uppercase tracking-wide">{title}</h3>
        </div>
        <div className="px-4 py-6 text-center">
          <p className="text-sm text-muted-foreground">
            No {type} categories yet
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={cn(
      "border border-border bg-card h-full flex flex-col",
      scrollable && "overflow-hidden"
    )}>
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border flex-shrink-0">
        {icon}
        <h3 className="text-sm font-semibold uppercase tracking-wide">{title}</h3>
        <span className="text-xs text-muted-foreground ml-auto">
          {categories.length} {categories.length === 1 ? 'item' : 'items'}
        </span>
      </div>
      
      {/* Content */}
      <div className={cn(
        "flex-1",
        scrollable && "overflow-y-auto",
        compact ? "p-3" : "p-4"
      )}>
        <div className={cn(
          "flex flex-col",
          compact ? "gap-2" : "gap-3"
        )}>
          {categories.map((category) => (
            <CategoryRow
              key={category.id}
              category={category}
              actual={getCategoryActual(category.id)}
              target={getCategoryTarget(category.id)}
              colorClass={colorClass}
              compact={compact}
              showProgress={type === 'expense'}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

interface CategoryRowProps {
  category: BudgetCategoryDTO
  actual: number
  target: number
  colorClass: string
  compact?: boolean
  showProgress?: boolean
}

function CategoryRow({ category, actual, target, colorClass, compact = false, showProgress = true }: CategoryRowProps) {
  const progress = target > 0 ? Math.min((actual / target) * 100, 100) : 0
  const isOver = actual > target && target > 0

  return (
    <div className={cn(
      "border border-border bg-background",
      compact ? "px-3 py-2" : "px-4 py-3"
    )}>
      <div className="flex justify-between items-center">
        <span className={cn(
          "font-medium truncate",
          compact ? "text-xs" : "text-sm"
        )}>
          {category.name}
        </span>
        <div className="flex items-baseline gap-1 ml-2 flex-shrink-0">
          <span
            className={cn(
              'font-bold tabular-nums',
              compact ? "text-xs" : "text-sm",
              isOver && colorClass === 'expense' ? 'text-red-600' : '',
              colorClass === 'income' && 'text-green-600'
            )}
          >
            {formatCurrency(actual)}
          </span>
          {target > 0 && (
            <span className={cn(
              "text-muted-foreground tabular-nums",
              compact ? "text-[10px]" : "text-xs"
            )}>
              / {formatCurrency(target)}
            </span>
          )}
        </div>
      </div>
      
      {/* Progress bar - only for expenses with targets */}
      {showProgress && target > 0 && (
        <div className="mt-2 h-1 bg-muted overflow-hidden">
          <div
            className={cn(
              "h-full transition-all duration-300",
              colorClass === 'expense' && !isOver && "bg-primary",
              colorClass === 'expense' && isOver && "bg-red-600",
              colorClass === 'income' && "bg-green-600"
            )}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  )
}
