import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import User from '#models/user'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Transaction, { TransactionDTO } from '#models/transaction'

export type CreateBucketDTO = {
  userId?: number
  name: string
  description: string
  goalAmount: number
}

export type BucketDTO = {
  id: number
  name: string
  description: string
  goalAmount: number
  transactions: TransactionDTO[]
}

export default class Bucket extends BaseModel {
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
  declare goalAmount: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @hasMany(() => Transaction, {
    foreignKey: 'bucketId',
  })
  declare transactions: HasMany<typeof Transaction>
}
