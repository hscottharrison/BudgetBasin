import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'budget_entries'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('budget_period_id').unsigned().references('id').inTable('budget_periods').onDelete('CASCADE')
      table.integer('budget_category_id').unsigned().references('id').inTable('budget_categories').onDelete('CASCADE')
      table.decimal('amount', 12, 2).notNullable()
      table.string('note').nullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
