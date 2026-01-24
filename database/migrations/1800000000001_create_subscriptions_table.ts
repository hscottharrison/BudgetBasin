import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'subscriptions'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('user_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
        .unique()

      // Stripe identifiers
      table.string('stripe_customer_id').notNullable().unique()
      table.string('stripe_subscription_id').unique().nullable()
      table.string('stripe_price_id').nullable()

      // Subscription status
      table
        .enum('status', [
          'trialing',
          'active',
          'past_due',
          'canceled',
          'unpaid',
          'incomplete',
          'incomplete_expired',
        ])
        .defaultTo('incomplete')

      // Important dates
      table.timestamp('trial_ends_at').nullable()
      table.timestamp('current_period_start').nullable()
      table.timestamp('current_period_end').nullable()
      table.timestamp('canceled_at').nullable()
      table.timestamp('ends_at').nullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
