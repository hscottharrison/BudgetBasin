import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  async up() {
    this.schema.renameTable('deduction_types', 'transaction_types')
  }

  async down() {
    this.schema.renameTable('transaction_types', 'deduction_types')
  }
}
