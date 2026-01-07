// Frontend-friendly types for budget feature
// These mirror the backend DTOs but are self-contained for the frontend

export type BudgetCategoryType = 'income' | 'expense'

export interface BudgetCategoryDTO {
  id: number
  name: string
  type: BudgetCategoryType
  sortOrder: number
}

export interface BudgetTemplateItemDTO {
  id: number
  budgetTemplateId: number
  budgetCategoryId: number
  category: BudgetCategoryDTO
  amount: number
}

export interface BudgetTemplateDTO {
  id: number
  name: string
  isActive: boolean
  items: BudgetTemplateItemDTO[]
}

export type BudgetPeriodStatus = 'active' | 'closed'

export interface BudgetEntryDTO {
  id: number
  budgetPeriodId: number
  budgetCategoryId: number
  category: BudgetCategoryDTO
  amount: number
  note: string | null
  createdAt: string | null
}

export interface BudgetPeriodDTO {
  id: number
  year: number
  month: number
  status: BudgetPeriodStatus
  entries: BudgetEntryDTO[]
}

export interface BankAccountDTO {
  id: number
  name: string
  accountType: 'checking' | 'savings'
  balances: {
    id: number
    amount: number
    bankAccountId: number
    createdAt: string | null
  }[]
  createdAt: string | null
}

export interface MonthlyBudgetPageDTO {
  user: {
    firstName: string
    lastName: string
  }
  categories: BudgetCategoryDTO[]
  template: BudgetTemplateDTO | null
  currentPeriod: BudgetPeriodDTO | null
  checkingAccount: BankAccountDTO | null
}



