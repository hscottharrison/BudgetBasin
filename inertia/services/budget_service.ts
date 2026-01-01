import {
  BudgetCategoryDTO,
  BudgetTemplateDTO,
  BudgetPeriodDTO,
  BudgetEntryDTO,
  BankAccountDTO,
} from '~/types/budget'

export interface CreateBudgetSetupPayload {
  budgetName: string
  income: number
  startingBalance?: number
  expenses: { category: string; amount: number }[]
}

export interface CreateBudgetSetupResponse {
  categories: BudgetCategoryDTO[]
  template: BudgetTemplateDTO
  period: BudgetPeriodDTO
  checkingAccount: BankAccountDTO | null
}

export interface CreateEntryPayload {
  budgetPeriodId: number
  budgetCategoryId: number
  amount: number
  note?: string
}

export interface CreateCategoryPayload {
  name: string
  type: 'income' | 'expense'
  sortOrder?: number
}

/**
 * Create a complete budget setup (categories, template, period)
 */
export async function createBudgetSetup(
  payload: CreateBudgetSetupPayload
): Promise<CreateBudgetSetupResponse> {
  console.log('budget_service: createBudgetSetup called with payload:', payload)
  
  try {
    console.log('budget_service: Making fetch request to /api/budget/setup')
    const res = await fetch('/api/budget/setup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
    console.log('budget_service: Response status:', res.status)

    if (!res.ok) {
      const error = await res.json()
      console.log('budget_service: Error response:', error)
      throw new Error(error.error || 'Failed to create budget setup')
    }

    const data = await res.json()
    console.log('budget_service: Success response:', data)
    return data
  } catch (err) {
    console.error('budget_service: Fetch error:', err)
    throw err
  }
}

/**
 * Create a new budget category
 */
export async function createBudgetCategory(
  payload: CreateCategoryPayload
): Promise<BudgetCategoryDTO> {
  const res = await fetch('/api/budget/categories', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || 'Failed to create category')
  }

  return res.json()
}

/**
 * Create a new budget period for the current month
 */
export async function createBudgetPeriod(): Promise<BudgetPeriodDTO> {
  const res = await fetch('/api/budget/periods', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || 'Failed to create period')
  }

  return res.json()
}

/**
 * Create a new budget entry
 */
export async function createBudgetEntry(
  payload: CreateEntryPayload
): Promise<BudgetEntryDTO> {
  const res = await fetch('/api/budget/entries', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || 'Failed to create entry')
  }

  return res.json()
}

/**
 * Delete all budget data (categories, templates, periods, entries)
 * This allows starting fresh with a new budget
 */
export async function deleteAllBudgetData(): Promise<void> {
  console.log('budget_service: deleteAllBudgetData called')
  try {
    console.log('budget_service: Making DELETE request to /api/budget/all')
    const res = await fetch('/api/budget/all', {
      method: 'DELETE',
    })
    console.log('budget_service: Response status:', res.status)

    if (!res.ok) {
      const error = await res.json()
      console.log('budget_service: Error response:', error)
      throw new Error(error.error || 'Failed to delete budget data')
    }
    console.log('budget_service: Delete successful')
  } catch (err) {
    console.error('budget_service: Delete error:', err)
    throw err
  }
}

/**
 * Delete a specific budget period
 */
export async function deleteBudgetPeriod(periodId: number): Promise<void> {
  const res = await fetch(`/api/budget/periods/${periodId}`, {
    method: 'DELETE',
  })

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || 'Failed to delete period')
  }
}
