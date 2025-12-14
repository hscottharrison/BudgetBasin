import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import BankAccount from '#models/bank_account'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Bucket from '#models/bucket'
import Transaction from '#models/transaction'
import BudgetCategory from '#models/budget_category'
import BudgetTemplate from '#models/budget_template'
import BudgetPeriod from '#models/budget_period'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare firstName: string

  @column()
  declare lastName: string

  @column()
  declare email: string

  @column({ serializeAs: null })
  declare password: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @hasMany(() => BankAccount, {
    foreignKey: 'userId',
  })
  declare bankAccounts: HasMany<typeof BankAccount>

  @hasMany(() => Bucket, {
    foreignKey: 'userId',
  })
  declare buckets: HasMany<typeof Bucket>

  @hasMany(() => Transaction, {
    foreignKey: 'userId',
  })
  declare allocations: HasMany<typeof Transaction>

  @hasMany(() => BudgetCategory, {
    foreignKey: 'userId',
  })
  declare budgetCategories: HasMany<typeof BudgetCategory>

  @hasMany(() => BudgetTemplate, {
    foreignKey: 'userId',
  })
  declare budgetTemplates: HasMany<typeof BudgetTemplate>

  @hasMany(() => BudgetPeriod, {
    foreignKey: 'userId',
  })
  declare budgetPeriods: HasMany<typeof BudgetPeriod>
}
