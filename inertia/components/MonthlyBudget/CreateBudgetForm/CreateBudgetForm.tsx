import { FormEvent, useMemo, useState } from 'react'
import { Box, Button, Card, Flex, Heading, IconButton, Separator, Text, TextField } from '@radix-ui/themes'
import { Trash2Icon } from 'lucide-react'
import { formatCurrency } from '~/services/utils_service'
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
  const totalExpenses = useMemo(
    () => expenses.reduce((sum, exp) => sum + exp.amount, 0),
    [expenses]
  )

  const leftToSpend = useMemo(
    () => projectedIncome - totalExpenses,
    [projectedIncome, totalExpenses]
  )

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
    setExpenses(
      expenses.map((exp) => (exp.id === id ? { ...exp, amount: Math.max(0, amount) } : exp))
    )
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
        <Box className="form-section">
          <Heading size="4" mb="4">Create New Budget</Heading>
          
          <Flex direction="column" gap="3">
            <Box>
              <Text as="label" size="2" weight="medium" mb="1" style={{ display: 'block' }}>
                Budget Name
              </Text>
              <TextField.Root
                placeholder="e.g., December 2024"
                value={budgetName}
                onChange={(e) => setBudgetName(e.target.value)}
              />
            </Box>

            <Box>
              <Text as="label" size="2" weight="medium" mb="1" style={{ display: 'block' }}>
                Projected Income
              </Text>
              <TextField.Root
                type="number"
                step="0.01"
                placeholder="0.00"
                value={projectedIncome || ''}
                onChange={(e) => setProjectedIncome(Number(e.target.value))}
              />
            </Box>

            <Box>
              <Text as="label" size="2" weight="medium" mb="1" style={{ display: 'block' }}>
                Checking Account Balance (Optional)
              </Text>
              <TextField.Root
                type="number"
                step="0.01"
                placeholder="0.00"
                value={startingBalance || ''}
                onChange={(e) => setStartingBalance(Number(e.target.value))}
              />
              <Text size="1" color="gray" mt="1" style={{ display: 'block' }}>
                Creates a checking account for reconciliation. This is NOT counted as income.
              </Text>
            </Box>
          </Flex>
        </Box>

        <Separator size="4" />

        {/* Expenses Section */}
        <Box className="form-section expenses-section">
          <Flex justify="between" align="center" mb="3">
            <Heading size="3">Expenses</Heading>
            <Text
              size="2"
              weight="medium"
              color={leftToSpend < 0 ? 'red' : leftToSpend === 0 ? 'gray' : 'green'}
            >
              {formatCurrency(leftToSpend)} left
            </Text>
          </Flex>

          {/* Add Expense Row */}
          <Flex gap="2" align="end" mb="3">
            <Box style={{ flex: 1 }}>
              <Text as="label" size="1" color="gray" mb="1" style={{ display: 'block' }}>
                Category
              </Text>
              <TextField.Root
                size="2"
                placeholder="e.g., Groceries"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </Box>
            <Box style={{ width: 100 }}>
              <Text as="label" size="1" color="gray" mb="1" style={{ display: 'block' }}>
                Amount
              </Text>
              <TextField.Root
                size="2"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={newAmount || ''}
                onChange={(e) => setNewAmount(Number(e.target.value))}
                onKeyDown={handleKeyDown}
              />
            </Box>
            <Button type="button" size="2" onClick={handleAddExpense} disabled={!newCategory.trim()}>
              Add
            </Button>
          </Flex>

          {/* Expense List */}
          <Box className="expense-list">
            {expenses.length === 0 ? (
              <Text size="2" color="gray" style={{ textAlign: 'center', padding: '1rem' }}>
                No expenses added yet
              </Text>
            ) : (
              expenses.map((expense) => (
                <Flex key={expense.id} align="center" gap="2" className="expense-row">
                  <Text size="2" style={{ flex: 1 }}>{expense.category}</Text>
                  <TextField.Root
                    size="1"
                    type="number"
                    step="0.01"
                    value={expense.amount || ''}
                    onChange={(e) => handleUpdateAmount(expense.id, Number(e.target.value))}
                    style={{ width: 80 }}
                  />
                  <IconButton
                    type="button"
                    size="1"
                    variant="ghost"
                    color="gray"
                    onClick={() => handleDeleteExpense(expense.id)}
                  >
                    <Trash2Icon size={14} />
                  </IconButton>
                </Flex>
              ))
            )}
          </Box>
        </Box>

        {/* Footer */}
        <Box className="form-footer">
          <Flex gap="2" justify="end">
            {onCancel && (
              <Button type="button" variant="soft" color="gray" onClick={onCancel}>
                Cancel
              </Button>
            )}
            <Button type="submit" disabled={!budgetName.trim() || projectedIncome <= 0 || isLoading}>
              {isLoading ? 'Creating...' : 'Create Budget'}
            </Button>
          </Flex>
        </Box>
      </form>
    </Card>
  )
}
