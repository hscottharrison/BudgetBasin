import React, { createContext, useContext, useMemo, useState, ReactNode } from 'react'
import {
  BudgetCategoryDTO,
  BudgetTemplateDTO,
  BudgetPeriodDTO,
  BudgetEntryDTO,
} from '~/types/budget'

export interface MonthlyBudgetContextProps {
  // Data
  categories: BudgetCategoryDTO[]
  template: BudgetTemplateDTO | null
  currentPeriod: BudgetPeriodDTO | null
  hasSetup: boolean

  // Computed
  incomeCategories: BudgetCategoryDTO[]
  expenseCategories: BudgetCategoryDTO[]
  totalExpectedIncome: number
  totalBudgetedExpenses: number
  totalActualIncome: number
  totalActualExpenses: number
  remainingBudget: number

  // Category totals
  getCategoryActual: (categoryId: number) => number
  getCategoryTarget: (categoryId: number) => number

  // Actions
  addCategory: (category: BudgetCategoryDTO) => void
  updateCategories: (categories: BudgetCategoryDTO[]) => void
  setTemplate: (template: BudgetTemplateDTO) => void
  setPeriod: (period: BudgetPeriodDTO) => void
  addEntry: (entry: BudgetEntryDTO) => void
}

const MonthlyBudgetContext = createContext<MonthlyBudgetContextProps | undefined>(undefined)

export const MonthlyBudgetProvider: React.FC<{
  initialCategories: BudgetCategoryDTO[]
  initialTemplate: BudgetTemplateDTO | null
  initialPeriod: BudgetPeriodDTO | null
  children: ReactNode
}> = ({ initialCategories, initialTemplate, initialPeriod, children }) => {
  const [categories, setCategories] = useState<BudgetCategoryDTO[]>(initialCategories)
  const [template, setTemplateState] = useState<BudgetTemplateDTO | null>(initialTemplate)
  const [currentPeriod, setCurrentPeriod] = useState<BudgetPeriodDTO | null>(initialPeriod)

  // Check if user has completed setup
  const hasSetup = useMemo(() => {
    return categories.length > 0 && template !== null
  }, [categories, template])

  // Split categories by type
  const incomeCategories = useMemo(
    () => categories.filter((c) => c.type === 'income').sort((a, b) => a.sortOrder - b.sortOrder),
    [categories]
  )

  const expenseCategories = useMemo(
    () => categories.filter((c) => c.type === 'expense').sort((a, b) => a.sortOrder - b.sortOrder),
    [categories]
  )

  // Calculate totals from template
  const totalExpectedIncome = useMemo(() => {
    if (!template) return 0
    return template.items
      .filter((item) => {
        const cat = categories.find((c) => c.id === item.budgetCategoryId)
        return cat?.type === 'income'
      })
      .reduce((sum, item) => sum + item.amount, 0)
  }, [template, categories])

  const totalBudgetedExpenses = useMemo(() => {
    if (!template) return 0
    return template.items
      .filter((item) => {
        const cat = categories.find((c) => c.id === item.budgetCategoryId)
        return cat?.type === 'expense'
      })
      .reduce((sum, item) => sum + item.amount, 0)
  }, [template, categories])

  // Calculate actuals from period entries
  const totalActualIncome = useMemo(() => {
    if (!currentPeriod) return 0
    return currentPeriod.entries
      .filter((entry) => {
        const cat = categories.find((c) => c.id === entry.budgetCategoryId)
        return cat?.type === 'income'
      })
      .reduce((sum, entry) => sum + entry.amount, 0)
  }, [currentPeriod, categories])

  const totalActualExpenses = useMemo(() => {
    if (!currentPeriod) return 0
    return currentPeriod.entries
      .filter((entry) => {
        const cat = categories.find((c) => c.id === entry.budgetCategoryId)
        return cat?.type === 'expense'
      })
      .reduce((sum, entry) => sum + entry.amount, 0)
  }, [currentPeriod, categories])

  const remainingBudget = useMemo(() => {
    return totalActualIncome - totalActualExpenses
  }, [totalActualIncome, totalActualExpenses])

  // Get actual spent/received for a category
  const getCategoryActual = (categoryId: number): number => {
    if (!currentPeriod) return 0
    return currentPeriod.entries
      .filter((e) => e.budgetCategoryId === categoryId)
      .reduce((sum, e) => sum + e.amount, 0)
  }

  // Get target amount for a category from template
  const getCategoryTarget = (categoryId: number): number => {
    if (!template) return 0
    const item = template.items.find((i) => i.budgetCategoryId === categoryId)
    return item?.amount ?? 0
  }

  // Actions
  const addCategory = (category: BudgetCategoryDTO) => {
    setCategories([...categories, category])
  }

  const updateCategories = (newCategories: BudgetCategoryDTO[]) => {
    setCategories(newCategories)
  }

  const setTemplate = (newTemplate: BudgetTemplateDTO) => {
    setTemplateState(newTemplate)
  }

  const setPeriod = (period: BudgetPeriodDTO) => {
    setCurrentPeriod(period)
  }

  const addEntry = (entry: BudgetEntryDTO) => {
    if (!currentPeriod) return
    setCurrentPeriod({
      ...currentPeriod,
      entries: [...currentPeriod.entries, entry],
    })
  }

  const value: MonthlyBudgetContextProps = {
    categories,
    template,
    currentPeriod,
    hasSetup,
    incomeCategories,
    expenseCategories,
    totalExpectedIncome,
    totalBudgetedExpenses,
    totalActualIncome,
    totalActualExpenses,
    remainingBudget,
    getCategoryActual,
    getCategoryTarget,
    addCategory,
    updateCategories,
    setTemplate,
    setPeriod,
    addEntry,
  }

  return <MonthlyBudgetContext.Provider value={value}>{children}</MonthlyBudgetContext.Provider>
}

export const useMonthlyBudget = (): MonthlyBudgetContextProps => {
  const context = useContext(MonthlyBudgetContext)
  if (!context) {
    throw new Error('useMonthlyBudget must be used within a MonthlyBudgetProvider')
  }
  return context
}

