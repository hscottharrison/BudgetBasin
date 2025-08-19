import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'balances'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('bank_account_id')
        .unsigned()
        .references('id')
        .inTable('bank_accounts')
        .onDelete('CASCADE') // Foreign Key Declaration
      table.integer('amount').notNullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
