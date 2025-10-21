import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'transactions'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table
        .integer('transaction_type_id')
        .unsigned()
        .references('id')
        .inTable('transaction_types')
        .onDelete('CASCADE')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('transaction_type_id')
    })
  }
}
