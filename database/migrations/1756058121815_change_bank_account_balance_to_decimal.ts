import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'balances'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.decimal('amount', 8, 2).alter()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('amount').alter()
    })
  }
}
