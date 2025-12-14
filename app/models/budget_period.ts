import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import User from '#models/user'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import BudgetTemplate from '#models/budget_template'
import BudgetEntry, { BudgetEntryDTO } from '#models/budget_entry'

export type BudgetPeriodStatus = 'active' | 'closed'

export type BudgetPeriodDTO = {
  id: number
  year: number
  month: number
  status: BudgetPeriodStatus
  entries: BudgetEntryDTO[]
}

export type CreateBudgetPeriodDTO = {
  userId?: number
  budgetTemplateId?: number
  year: number
  month: number
  status?: BudgetPeriodStatus
}

export default class BudgetPeriod extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number
  @belongsTo(() => User, {
    foreignKey: 'userId',
  })
  declare user: BelongsTo<typeof User>

  @column()
  declare budgetTemplateId: number | null
  @belongsTo(() => BudgetTemplate, {
    foreignKey: 'budgetTemplateId',
  })
  declare template: BelongsTo<typeof BudgetTemplate>

  @column()
  declare year: number

  @column()
  declare month: number

  @column()
  declare status: BudgetPeriodStatus

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @hasMany(() => BudgetEntry, {
    foreignKey: 'budgetPeriodId',
  })
  declare entries: HasMany<typeof BudgetEntry>
}

