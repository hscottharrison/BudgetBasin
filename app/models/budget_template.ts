import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import User from '#models/user'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import BudgetTemplateItem, { BudgetTemplateItemDTO } from '#models/budget_template_item'
import BudgetPeriod from '#models/budget_period'

export type BudgetTemplateDTO = {
  id: number
  name: string
  isActive: boolean
  items: BudgetTemplateItemDTO[]
}

export type CreateBudgetTemplateDTO = {
  userId?: number
  name: string
  isActive?: boolean
}

export default class BudgetTemplate extends BaseModel {
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
  declare isActive: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @hasMany(() => BudgetTemplateItem, {
    foreignKey: 'budgetTemplateId',
  })
  declare items: HasMany<typeof BudgetTemplateItem>

  @hasMany(() => BudgetPeriod, {
    foreignKey: 'budgetTemplateId',
  })
  declare periods: HasMany<typeof BudgetPeriod>
}

