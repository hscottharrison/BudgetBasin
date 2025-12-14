import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'budget_periods'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.integer('budget_template_id').unsigned().references('id').inTable('budget_templates').onDelete('SET NULL').nullable()
      table.integer('year').notNullable()
      table.integer('month').notNullable()
      table.enum('status', ['active', 'closed']).defaultTo('active')
      table.timestamp('created_at')
      table.timestamp('updated_at')

      // Ensure unique year/month per user
      table.unique(['user_id', 'year', 'month'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
