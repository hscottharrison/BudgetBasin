import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import BudgetTemplate from '#models/budget_template'
import BudgetCategory, { BudgetCategoryDTO } from '#models/budget_category'

export type BudgetTemplateItemDTO = {
  id: number
  budgetTemplateId: number
  budgetCategoryId: number
  category: BudgetCategoryDTO
  amount: number
}

export type CreateBudgetTemplateItemDTO = {
  budgetTemplateId: number
  budgetCategoryId: number
  amount: number
}

export default class BudgetTemplateItem extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare budgetTemplateId: number
  @belongsTo(() => BudgetTemplate, {
    foreignKey: 'budgetTemplateId',
  })
  declare template: BelongsTo<typeof BudgetTemplate>

  @column()
  declare budgetCategoryId: number
  @belongsTo(() => BudgetCategory, {
    foreignKey: 'budgetCategoryId',
  })
  declare category: BelongsTo<typeof BudgetCategory>

  @column()
  declare amount: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}

