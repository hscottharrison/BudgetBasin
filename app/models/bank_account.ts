import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import User from '#models/user'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Balance, { BalanceDTO } from '#models/balance'

export type BankAccountType = 'savings' | 'checking'

export type BankAccountDTO = {
  id: number
  name: string
  accountType: BankAccountType
  balances: BalanceDTO[]
  createdAt: string | null
}

export default class BankAccount extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number
  @belongsTo(() => User, {
    foreignKey: 'userId',
  })
  declare user: BelongsTo<typeof User>

  @column()
  declare name: string

  @column()
  declare description: string

  @column()
  declare accountType: BankAccountType

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @hasMany(() => Balance, {
    foreignKey: 'bankAccountId',
  })
  declare balances: HasMany<typeof Balance>
}
