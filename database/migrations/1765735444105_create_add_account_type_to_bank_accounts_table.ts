import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'bank_accounts'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.enum('account_type', ['savings', 'checking']).defaultTo('savings')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('account_type')
    })
  }
}
