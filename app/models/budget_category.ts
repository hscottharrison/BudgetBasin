import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import User from '#models/user'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import BudgetTemplateItem from '#models/budget_template_item'
import BudgetEntry from '#models/budget_entry'

export type BudgetCategoryType = 'income' | 'expense'

export type BudgetCategoryDTO = {
  id: number
  name: string
  type: BudgetCategoryType
  sortOrder: number
}

export type CreateBudgetCategoryDTO = {
  userId?: number
  name: string
  type: BudgetCategoryType
  sortOrder?: number
}

export default class BudgetCategory extends BaseModel {
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
  declare type: BudgetCategoryType

  @column()
  declare sortOrder: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @hasMany(() => BudgetTemplateItem, {
    foreignKey: 'budgetCategoryId',
  })
  declare templateItems: HasMany<typeof BudgetTemplateItem>

  @hasMany(() => BudgetEntry, {
    foreignKey: 'budgetCategoryId',
  })
  declare entries: HasMany<typeof BudgetEntry>
}

