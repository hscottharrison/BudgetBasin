import { useState } from 'react'
import { Button } from '~/components/ui/button'
import { Trash2 } from 'lucide-react'
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
import BudgetSetupPrompt from '~/components/MonthlyBudget/BudgetSetupPrompt/BudgetSetupPrompt'
import CreateBudgetForm from '~/components/MonthlyBudget/CreateBudgetForm/CreateBudgetForm'
import BudgetViewToggle from '~/components/MonthlyBudget/BudgetViewToggle/BudgetViewToggle'

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

  if (!hasSetup || !hasPeriod) {
    return (
      <div className="w-full max-w-[1120px] mx-auto p-6 flex flex-col gap-4 flex-1 min-h-0 overflow-auto">
        {error && (
          <div className="p-3 bg-destructive/10 text-destructive text-sm border border-destructive/20">
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

  return (
    <div className="w-full max-w-ci[1120px] mx-auto p-6 flex flex-col flex-1 min-h-0 overflow-hidden">
      {/* Summary - Fixed */}
      <div className="flex-shrink-0 mb-4">
        <BudgetSummaryCard />
      </div>

      {/* Actions Bar - Fixed */}
      <div className="flex-shrink-0 mb-4">
        <div className="flex justify-between items-center gap-2">
          <BudgetActionsBar onAddEntry={handleAddEntry} onAddCategory={handleAddCategory} />
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDeleteBudget}
            disabled={isLoading}
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 size={14} />
            Reset
          </Button>
        </div>
      </div>
      <BudgetViewToggle />
    </div>
  )

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
      addEntry(response.entry)
      if (response.newBalance !== null) {
        updateCheckingBalance(response.newBalance)
      }
    } catch (err) {
      console.error('Add entry error:', err)
      setError(err instanceof Error ? err.message : 'Failed to add entry')
    }
  }

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

  async function handleCreateBudget(data: {
    name: string
    income: number
    startingBalance: number
    expenses: { category: string; amount: number }[]
  }) {
    setIsLoading(true)
    setError(null)

    try {
      const result = await createBudgetSetup({
        budgetName: data.name,
        income: data.income,
        startingBalance: data.startingBalance,
        expenses: data.expenses,
      })

      updateCategories(result.categories)
      setTemplate(result.template)
      setPeriod(result.period)
      if (result.checkingAccount) {
        setCheckingAccount(result.checkingAccount)
      }
      setShowCreateBudgetForm(false)
    } catch (err) {
      console.error('Create budget error:', err)
      setError(err instanceof Error ? err.message : 'Failed to create budget')
    } finally {
      setIsLoading(false)
    }
  }

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

  async function handleDeleteBudget() {
    const confirmed = window.confirm(
      'Are you sure you want to delete your entire budget? This action cannot be undone.'
    )

    if (!confirmed) return

    setIsLoading(true)
    setError(null)

    try {
      await deleteAllBudgetData()
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
