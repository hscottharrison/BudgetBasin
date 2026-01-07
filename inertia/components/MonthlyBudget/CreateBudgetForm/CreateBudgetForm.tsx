import { FormEvent, useMemo, useState } from 'react'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '~/components/ui/card'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Separator } from '@radix-ui/react-separator'
import { Trash2Icon } from 'lucide-react'
import { formatCurrency } from '~/services/utils_service'
import { cn } from '~/lib/utils'
import './style.css'

interface ExpenseItem {
  id: string
  category: string
  amount: number
}

interface CreateBudgetFormProps {
  onCancel?: () => void
  onSubmit?: (data: {
    name: string
    income: number
    startingBalance: number
    expenses: { category: string; amount: number }[]
  }) => void
  isLoading?: boolean
}

export default function CreateBudgetForm({ onCancel, onSubmit, isLoading }: CreateBudgetFormProps) {
  const [budgetName, setBudgetName] = useState('')
  const [projectedIncome, setProjectedIncome] = useState<number>(0)
  const [startingBalance, setStartingBalance] = useState<number>(0)
  const [expenses, setExpenses] = useState<ExpenseItem[]>([])
  const [newCategory, setNewCategory] = useState('')
  const [newAmount, setNewAmount] = useState<number>(0)

  // Calculate totals
  const totalExpenses = useMemo(() => expenses.reduce((sum, exp) => sum + exp.amount, 0), [expenses])

  const leftToSpend = useMemo(() => projectedIncome - totalExpenses, [projectedIncome, totalExpenses])

  function handleAddExpense() {
    if (!newCategory.trim()) return

    const newExpense: ExpenseItem = {
      id: crypto.randomUUID(),
      category: newCategory.trim(),
      amount: newAmount,
    }
    setExpenses([...expenses, newExpense])
    setNewCategory('')
    setNewAmount(0)
  }

  function handleDeleteExpense(id: string) {
    setExpenses(expenses.filter((exp) => exp.id !== id))
  }

  function handleUpdateAmount(id: string, amount: number) {
    setExpenses(expenses.map((exp) => (exp.id === id ? { ...exp, amount: Math.max(0, amount) } : exp)))
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    onSubmit?.({
      name: budgetName,
      income: projectedIncome,
      startingBalance,
      expenses: expenses.map(({ category, amount }) => ({ category, amount })),
    })
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddExpense()
    }
  }

  return (
    <Card className="create-budget-card">
      <form onSubmit={handleSubmit} className="create-budget-form">
        {/* Header Section */}
        <CardHeader>
          <CardTitle>Create New Budget</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="budget-name">Budget Name</Label>
              <Input
                id="budget-name"
                placeholder="e.g., December 2024"
                value={budgetName}
                onChange={(e) => setBudgetName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="projected-income">Projected Income</Label>
              <Input
                id="projected-income"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={projectedIncome || ''}
                onChange={(e) => setProjectedIncome(Number(e.target.value))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="starting-balance">Checking Account Balance (Optional)</Label>
              <Input
                id="starting-balance"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={startingBalance || ''}
                onChange={(e) => setStartingBalance(Number(e.target.value))}
              />
              <p className="text-xs text-muted-foreground">
                Creates a checking account for reconciliation. This is NOT counted as income.
              </p>
            </div>
          </div>

          <Separator className="my-4" />

          {/* Expenses Section */}
          <div className="expenses-section space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Expenses</h3>
              <span
                className={cn(
                  'text-sm font-medium',
                  leftToSpend < 0
                    ? 'text-red-600'
                    : leftToSpend === 0
                      ? 'text-muted-foreground'
                      : 'text-green-600'
                )}
              >
                {formatCurrency(leftToSpend)} left
              </span>
            </div>

            {/* Add Expense Row */}
            <div className="flex gap-2 items-end">
              <div className="flex-1 space-y-1">
                <Label htmlFor="new-category" className="text-xs text-muted-foreground">
                  Category
                </Label>
                <Input
                  id="new-category"
                  placeholder="e.g., Groceries"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
              </div>
              <div className="w-24 space-y-1">
                <Label htmlFor="new-amount" className="text-xs text-muted-foreground">
                  Amount
                </Label>
                <Input
                  id="new-amount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={newAmount || ''}
                  onChange={(e) => setNewAmount(Number(e.target.value))}
                  onKeyDown={handleKeyDown}
                />
              </div>
              <Button type="button" onClick={handleAddExpense} disabled={!newCategory.trim()}>
                Add
              </Button>
            </div>

            {/* Expense List */}
            <div className="expense-list space-y-1">
              {expenses.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No expenses added yet</p>
              ) : (
                expenses.map((expense) => (
                  <div key={expense.id} className="expense-row flex items-center gap-2 p-2 rounded-md hover:bg-accent">
                    <span className="flex-1 text-sm">{expense.category}</span>
                    <Input
                      type="number"
                      step="0.01"
                      value={expense.amount || ''}
                      onChange={(e) => handleUpdateAmount(expense.id, Number(e.target.value))}
                      className="w-20 h-8"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleDeleteExpense(expense.id)}
                    >
                      <Trash2Icon size={14} />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </div>
        </CardContent>

        {/* Footer */}
        <CardFooter className="flex gap-2 justify-end">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={!budgetName.trim() || projectedIncome <= 0 || isLoading}>
            {isLoading ? 'Creating...' : 'Create Budget'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
