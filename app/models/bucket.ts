import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import User from '#models/user'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Allocation, { AllocationDTO } from '#models/allocation'

export type CreateBucketDTO = {
  name: string
  description: string
  goalAmount: number
}

export type BucketDTO = {
  id: number
  name: string
  description: string
  goalAmount: number
  allocations: AllocationDTO[]
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

  @hasMany(() => Allocation, {
    foreignKey: 'bucketId',
  })
  declare allocations: HasMany<typeof Allocation>
}
