import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import Transaction from '#models/transaction'
import type { HasMany } from '@adonisjs/lucid/types/relations'

export enum TransactionTypes {
  ALLOCATION = 'allocation',
  SPEND = 'spend',
  TRANSFER = 'transfer',
}

export type TransactionTypeDTO = {
  id: number
  value: string
  label: string
}

export default class TransactionType extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare value: string

  @column()
  declare label: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @hasMany(() => Transaction, {
    foreignKey: 'transactionTypeId',
  })
  declare transactions: HasMany<typeof Transaction>
}
