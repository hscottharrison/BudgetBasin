import { useState } from 'react'
import { Box, Grid } from '@radix-ui/themes'
import { MonthlyBudgetProvider, useMonthlyBudget } from '~/context/MonthlyBudgetContext'
import { MonthlyBudgetPageDTO } from '~/types/budget'

import BudgetSummaryCard from '~/components/MonthlyBudget/BudgetSummaryCard/BudgetSummaryCard'
import BudgetActionsBar from '~/components/MonthlyBudget/BudgetActionsBar/BudgetActionsBar'
import CategoryList from '~/components/MonthlyBudget/CategoryList/CategoryList'
import BudgetSetupPrompt from '~/components/MonthlyBudget/BudgetSetupPrompt/BudgetSetupPrompt'
import CreateBudgetForm from '~/components/MonthlyBudget/CreateBudgetForm/CreateBudgetForm'

export default function MonthlyBudget({ categories, template, currentPeriod }: MonthlyBudgetPageDTO) {
  return (
    <MonthlyBudgetProvider
      initialCategories={categories ?? []}
      initialTemplate={template ?? null}
      initialPeriod={currentPeriod ?? null}
    >
      <MonthlyBudgetPage />
    </MonthlyBudgetProvider>
  )
}

function MonthlyBudgetPage() {
  const { hasSetup, currentPeriod, categories, template } = useMonthlyBudget()
  const [showCreateBudgetForm, setShowCreateBudgetForm] = useState(false)

  const hasCategories = categories.length > 0
  const hasTemplate = template !== null
  const hasPeriod = currentPeriod !== null

  // Show setup prompt if not fully configured
  if (!hasSetup || !hasPeriod) {
    return (
      <Box
        style={{
          width: '100%',
          maxWidth: 1120,
          marginInline: 'auto',
          padding: '2rem 1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          flex: 1,
          minHeight: 0,
          overflow: 'auto',
        }}
      >
        {showCreateBudgetForm ? (
          <CreateBudgetForm
            onCancel={() => setShowCreateBudgetForm(false)}
            onSubmit={handleCreateBudget}
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
      </Box>
    )
  }

  // Full budget view
  return (
    <Box
      style={{
        width: '100%',
        maxWidth: 1120,
        marginInline: 'auto',
        padding: '2rem 1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        flex: 1,
        minHeight: 0,
        overflow: 'hidden',
      }}
    >
      <Box style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, gap: '1rem' }}>
        {/* Summary Card */}
        <Box px="2">
          <BudgetSummaryCard />
        </Box>

        {/* Actions Bar */}
        <Box style={{ flex: '0 0 auto' }}>
          <BudgetActionsBar onAddEntry={handleAddEntry} onAddCategory={handleAddCategory} />
        </Box>

        {/* Category Lists */}
        <Box style={{ flex: 1, minHeight: 0, overflow: 'auto' }}>
          <Grid columns={{ xs: '1', md: '2' }} gap="4">
            <CategoryList type="income" title="📈 Income" />
            <CategoryList type="expense" title="📉 Expenses" />
          </Grid>
        </Box>
      </Box>
    </Box>
  )

  // Handler placeholders - these will call your API services
  async function handleAddEntry(entry: { budgetCategoryId: number; amount: number; note?: string }) {
    console.log('Add entry:', entry)
    // TODO: Call API to create budget entry
    // const response = await createBudgetEntry(entry)
    // addEntry(response)
  }

  async function handleAddCategory(category: { name: string; type: 'income' | 'expense' }) {
    console.log('Add category:', category)
    // TODO: Call API to create category
    // const response = await createBudgetCategory(category)
    // addCategory(response)
  }

  async function handleCreateBudget(data: {
    name: string
    income: number
    expenses: { category: string; amount: number }[]
  }) {
    console.log('Create budget:', data)
    // TODO: Call API to:
    // 1. Create expense categories for each expense item
    // 2. Create a budget template with the income and expense targets
    // 3. Create a budget period for the current month
    // 4. Update context with new data
    
    // Example flow:
    // const incomeCategory = await createBudgetCategory({ name: 'Income', type: 'income' })
    // const expenseCategories = await Promise.all(
    //   data.expenses.map(exp => createBudgetCategory({ name: exp.category, type: 'expense' }))
    // )
    // const template = await createBudgetTemplate({
    //   name: data.name,
    //   items: [
    //     { categoryId: incomeCategory.id, amount: data.income },
    //     ...expenseCategories.map((cat, i) => ({ categoryId: cat.id, amount: data.expenses[i].amount }))
    //   ]
    // })
    // const period = await createBudgetPeriod({ templateId: template.id })
    
    setShowCreateBudgetForm(false)
  }

  async function handleCreatePeriod() {
    console.log('Create period')
    // TODO: Call API to create new budget period
    // const now = new Date()
    // const response = await createBudgetPeriod({ year: now.getFullYear(), month: now.getMonth() + 1 })
    // setPeriod(response)
  }
}
