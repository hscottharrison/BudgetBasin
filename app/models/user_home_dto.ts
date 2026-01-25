import { BaseDTO } from '#models/base_dto'
import { BankAccountDTO } from '#models/bank_account'
import { BudgetPeriodDTO } from '#models/budget_period'
import { BudgetCategoryDTO } from '#models/budget_category'
import { BudgetTemplateDTO } from '#models/budget_template'

export interface UserHomeDTO extends BaseDTO {
  categories: BudgetCategoryDTO[]
  currentPeriod: BudgetPeriodDTO
  template: BudgetTemplateDTO
  userAccounts: BankAccountDTO[]
}
