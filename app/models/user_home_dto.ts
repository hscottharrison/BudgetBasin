import { BaseDTO } from '#models/base_dto'
import { BankAccountDTO } from '#models/bank_account'

export interface UserHomeDTO extends BaseDTO {
  userAccounts: BankAccountDTO[]
}
