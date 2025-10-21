import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import User from '#models/user'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Bucket from '#models/bucket'
import TransactionType, { TransactionTypeDTO } from '#models/transaction_type'

export type TransactionDTO = {
  bucketId: number
  userId: number
  amount: number
  transactionType: TransactionTypeDTO
  createdAt: string | null
}

export type CreateTransactionDTO = {
  bucketId: number
  transactionTypeId: number
  amount: number
}

export default class Transaction extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number
  @belongsTo(() => User, {
    foreignKey: 'userId',
  })
  declare user: BelongsTo<typeof User>

  @column()
  declare bucketId: number
  @belongsTo(() => Bucket, {
    foreignKey: 'bucketId',
  })
  declare bucket: BelongsTo<typeof Bucket>

  @column()
  declare transactionTypeId: number
  @belongsTo(() => TransactionType, {
    foreignKey: 'transactionTypeId',
  })
  declare transactionType: BelongsTo<typeof TransactionType>

  @column()
  declare amount: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
