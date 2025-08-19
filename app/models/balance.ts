import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import BankAccount from '#models/bank_account'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export type BalanceDTO = {
  id: number
  amount: number
  createdAt: string | null
}

export default class Balance extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare bankAccountId: number
  @belongsTo(() => BankAccount, {
    foreignKey: 'bankAccountId',
  })
  declare bankAccount: BelongsTo<typeof BankAccount>

  @column()
  declare amount: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
