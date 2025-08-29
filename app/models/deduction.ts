import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import Bucket from '#models/bucket'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import DeductionType from '#models/deduction_type'

export default class Deduction extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare deductionTypeId: number
  @belongsTo(() => DeductionType, {
    foreignKey: 'deductionTypeId',
  })
  declare deductionType: BelongsTo<typeof DeductionType>

  @column()
  declare bucketId: number
  @belongsTo(() => Bucket, {
    foreignKey: 'bucketId',
  })
  declare bucket: BelongsTo<typeof Bucket>

  declare description: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
