import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  async up() {
    this.schema.renameTable('allocations', 'transactions')
  }

  async down() {
    this.schema.renameTable('transactions', 'allocations')
  }
}
