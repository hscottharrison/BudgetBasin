import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('full_name')

      table.string('first_name').notNullable()
      table.string('last_name').notNullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('full_name').notNullable()

      table.dropColumn('first_name')
      table.dropColumn('last_name')
    })
  }
}
