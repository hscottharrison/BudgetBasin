import { BaseDTO } from '#models/base_dto'
import { BankAccountDTO } from '#models/bank_account'
import { BudgetPeriodDTO } from '#models/budget_period'
import { BudgetCategoryDTO } from '#models/budget_category'

export interface UserHomeDTO extends BaseDTO {
  userAccounts: BankAccountDTO[]
  currentPeriod: BudgetPeriodDTO
  categories: BudgetCategoryDTO[]
}
