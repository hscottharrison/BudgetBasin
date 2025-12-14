import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import BudgetPeriod from '#models/budget_period'
import BudgetCategory, { BudgetCategoryDTO } from '#models/budget_category'

export type BudgetEntryDTO = {
  id: number
  budgetPeriodId: number
  budgetCategoryId: number
  category: BudgetCategoryDTO
  amount: number
  note: string | null
  createdAt: string | null
}

export type CreateBudgetEntryDTO = {
  budgetPeriodId: number
  budgetCategoryId: number
  amount: number
  note?: string
}

export default class BudgetEntry extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare budgetPeriodId: number
  @belongsTo(() => BudgetPeriod, {
    foreignKey: 'budgetPeriodId',
  })
  declare period: BelongsTo<typeof BudgetPeriod>

  @column()
  declare budgetCategoryId: number
  @belongsTo(() => BudgetCategory, {
    foreignKey: 'budgetCategoryId',
  })
  declare category: BelongsTo<typeof BudgetCategory>

  @column()
  declare amount: number

  @column()
  declare note: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}

