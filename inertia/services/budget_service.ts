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
  const res = await fetch('/api/budget/setup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || 'Failed to create budget setup')
  }

  return res.json()
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

export interface CreateEntryResponse {
  entry: BudgetEntryDTO
  newBalance: number | null
}

/**
 * Create a new budget entry and update checking account balance
 */
export async function createBudgetEntry(
  payload: CreateEntryPayload
): Promise<CreateEntryResponse> {
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
  const res = await fetch('/api/budget/all', {
    method: 'DELETE',
  })

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || 'Failed to delete budget data')
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

export interface StartNewPeriodPayload {
  year: number
  month: number
  actualBalance?: number
}

export interface StartNewPeriodResponse {
  closedPeriod: BudgetPeriodDTO | null
  newPeriod: BudgetPeriodDTO
  newBalance: number | null
}

/**
 * Start a new budget period (closes current period, creates new period, and updates balance)
 */
export async function startNewPeriod(
  payload: StartNewPeriodPayload
): Promise<StartNewPeriodResponse> {
  const res = await fetch('/api/budget/periods/start-new', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || 'Failed to start new period')
  }

  return res.json()
}
