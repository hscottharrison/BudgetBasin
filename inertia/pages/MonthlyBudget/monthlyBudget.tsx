import { useState } from 'react'
import { Button } from '~/components/ui/button'
import { Trash2Icon } from 'lucide-react'
import { MonthlyBudgetProvider, useMonthlyBudget } from '~/context/MonthlyBudgetContext'
import { MonthlyBudgetPageDTO } from '~/types/budget'
import {
  createBudgetSetup,
  createBudgetPeriod,
  createBudgetEntry,
  createBudgetCategory,
  deleteAllBudgetData,
} from '~/services/budget_service'

import BudgetSummaryCard from '~/components/MonthlyBudget/BudgetSummaryCard/BudgetSummaryCard'
import BudgetActionsBar from '~/components/MonthlyBudget/BudgetActionsBar/BudgetActionsBar'
import CategoryList from '~/components/MonthlyBudget/CategoryList/CategoryList'
import BudgetSetupPrompt from '~/components/MonthlyBudget/BudgetSetupPrompt/BudgetSetupPrompt'
import CreateBudgetForm from '~/components/MonthlyBudget/CreateBudgetForm/CreateBudgetForm'

export default function MonthlyBudget({
  categories,
  template,
  currentPeriod,
  checkingAccount,
}: MonthlyBudgetPageDTO) {
  return (
    <MonthlyBudgetProvider
      initialCategories={categories ?? []}
      initialTemplate={template ?? null}
      initialPeriod={currentPeriod ?? null}
      initialCheckingAccount={checkingAccount ?? null}
    >
      <MonthlyBudgetPage />
    </MonthlyBudgetProvider>
  )
}

function MonthlyBudgetPage() {
  const {
    hasSetup,
    currentPeriod,
    categories,
    template,
    updateCategories,
    setTemplate,
    setPeriod,
    addEntry,
    addCategory,
    setCheckingAccount,
    updateCheckingBalance,
  } = useMonthlyBudget()
  const [showCreateBudgetForm, setShowCreateBudgetForm] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const hasCategories = categories.length > 0
  const hasTemplate = template !== null
  const hasPeriod = currentPeriod !== null

  // Show setup prompt if not fully configured
  if (!hasSetup || !hasPeriod) {
    return (
      <div className="w-full max-w-[1120px] mx-auto p-8 flex flex-col gap-4 flex-1 min-h-0 overflow-auto">
        {error && (
          <div className="p-4 bg-destructive/10 text-destructive rounded-lg mb-4">
            {error}
          </div>
        )}
        {showCreateBudgetForm ? (
          <CreateBudgetForm
            onCancel={() => setShowCreateBudgetForm(false)}
            onSubmit={handleCreateBudget}
            isLoading={isLoading}
          />
        ) : (
          <BudgetSetupPrompt
            hasCategories={hasCategories}
            hasTemplate={hasTemplate}
            hasPeriod={hasPeriod}
            onCreatePeriod={handleCreatePeriod}
            setShowCreateBudgetForm={setShowCreateBudgetForm}
          />
        )}
      </div>
    )
  }

  // Full budget view
  return (
    <div className="w-full max-w-[1120px] mx-auto p-8 flex flex-col gap-4 flex-1 min-h-0 overflow-hidden">
      <div className="flex flex-col flex-1 min-h-0 gap-4">
        {/* Summary Card */}
        <div className="px-2">
          <BudgetSummaryCard />
        </div>

        {/* Actions Bar */}
        <div className="flex-shrink-0">
          <div className="flex justify-between items-center gap-2">
            <BudgetActionsBar onAddEntry={handleAddEntry} onAddCategory={handleAddCategory} />
            <Button variant="destructive" size="default" onClick={handleDeleteBudget} disabled={isLoading}>
              <Trash2Icon size={16} />
              Start Over
            </Button>
          </div>
        </div>

        {/* Category Lists */}
        <div className="flex-1 min-h-0 overflow-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CategoryList type="income" title="📈 Income" />
            <CategoryList type="expense" title="📉 Expenses" />
          </div>
        </div>
      </div>
    </div>
  )

  // Handler to add a budget entry
  async function handleAddEntry(entry: {
    budgetCategoryId: number
    amount: number
    note?: string
  }) {
    if (!currentPeriod) return

    try {
      setError(null)
      const response = await createBudgetEntry({
        budgetPeriodId: currentPeriod.id,
        budgetCategoryId: entry.budgetCategoryId,
        amount: entry.amount,
        note: entry.note,
      })
      // Add the entry to the period
      addEntry(response.entry)
      // Update the checking balance if returned
      if (response.newBalance !== null) {
        updateCheckingBalance(response.newBalance)
      }
    } catch (err) {
      console.error('Add entry error:', err)
      setError(err instanceof Error ? err.message : 'Failed to add entry')
    }
  }

  // Handler to add a new category
  async function handleAddCategory(category: { name: string; type: 'income' | 'expense' }) {
    try {
      setError(null)
      const response = await createBudgetCategory(category)
      addCategory(response)
    } catch (err) {
      console.error('Add category error:', err)
      setError(err instanceof Error ? err.message : 'Failed to add category')
    }
  }

  // Handler to create a complete budget setup
  async function handleCreateBudget(data: {
    name: string
    income: number
    startingBalance: number
    expenses: { category: string; amount: number }[]
  }) {
    console.log('handleCreateBudget called with:', data)
    setIsLoading(true)
    setError(null)

    try {
      console.log('Calling createBudgetSetup API...')
      const result = await createBudgetSetup({
        budgetName: data.name,
        income: data.income,
        startingBalance: data.startingBalance,
        expenses: data.expenses,
      })
      console.log('Budget setup result:', result)

      // Update context with the new data
      updateCategories(result.categories)
      setTemplate(result.template)
      setPeriod(result.period)
      // Set the checking account if created
      if (result.checkingAccount) {
        setCheckingAccount(result.checkingAccount)
      }
      setShowCreateBudgetForm(false)
    } catch (err) {
      console.error('Create budget error:', err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to create budget'
      console.error('Error message:', errorMessage)
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  // Handler to create a new period (when template exists but no period)
  async function handleCreatePeriod() {
    setIsLoading(true)
    setError(null)

    try {
      const response = await createBudgetPeriod()
      setPeriod(response)
    } catch (err) {
      console.error('Create period error:', err)
      setError(err instanceof Error ? err.message : 'Failed to create period')
    } finally {
      setIsLoading(false)
    }
  }

  // Handler to delete all budget data and start fresh
  async function handleDeleteBudget() {
    console.log('handleDeleteBudget called')
    const confirmed = window.confirm(
      'Are you sure you want to delete your entire budget? This will remove all categories, templates, and entries. This action cannot be undone.'
    )

    if (!confirmed) {
      console.log('User cancelled delete')
      return
    }

    console.log('User confirmed delete, calling API...')
    setIsLoading(true)
    setError(null)

    try {
      await deleteAllBudgetData()
      console.log('Delete successful, resetting context')
      // Reset the context to empty state
      updateCategories([])
      setTemplate(null as any)
      setPeriod(null as any)
    } catch (err) {
      console.error('Delete budget error:', err)
      setError(err instanceof Error ? err.message : 'Failed to delete budget')
    } finally {
      setIsLoading(false)
    }
  }
}
