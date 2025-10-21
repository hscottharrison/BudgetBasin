import { BaseDTO } from '#models/base_dto'
import { BankAccountDTO } from '#models/bank_account'
import { BucketDTO } from '#models/bucket'
import { TransactionTypeDTO } from "#models/transaction_type";

export interface UserHomeDTO extends BaseDTO {
  userAccounts: BankAccountDTO[]
  userBuckets: BucketDTO[]
  transactionTypes: TransactionTypeDTO[]
}
