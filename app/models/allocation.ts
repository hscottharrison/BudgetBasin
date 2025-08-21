import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import User from '#models/user'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Bucket from '#models/bucket'

export type AllocationDTO = {
  bucketId: number
  userId: number
  amount: number
  createdAt: string | null
}

export type CreateAllocationDTO = {
  bucketId: number
  amount: number
}

export default class Allocation extends BaseModel {
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
  declare amount: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
