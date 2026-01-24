import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import User from '#models/user'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export type SubscriptionStatus =
  | 'trialing'
  | 'active'
  | 'past_due'
  | 'canceled'
  | 'unpaid'
  | 'incomplete'
  | 'incomplete_expired'

export type SubscriptionDTO = {
  id: number
  status: SubscriptionStatus
  isActive: boolean
  isTrial: boolean
  trialEndsAt: string | null
  currentPeriodEnd: string | null
  canceledAt: string | null
  endsAt: string | null
}

export default class Subscription extends BaseModel {
  static GRACE_PERIOD_DAYS = 3

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number

  @belongsTo(() => User, {
    foreignKey: 'userId',
  })
  declare user: BelongsTo<typeof User>

  @column()
  declare stripeCustomerId: string

  @column()
  declare stripeSubscriptionId: string | null

  @column()
  declare stripePriceId: string | null

  @column()
  declare status: SubscriptionStatus

  @column.dateTime()
  declare trialEndsAt: DateTime | null

  @column.dateTime()
  declare currentPeriodStart: DateTime | null

  @column.dateTime()
  declare currentPeriodEnd: DateTime | null

  @column.dateTime()
  declare canceledAt: DateTime | null

  @column.dateTime()
  declare endsAt: DateTime | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  /**
   * Check if subscription allows app access
   */
  get isActive(): boolean {
    const now = DateTime.now()

    // Active statuses
    if (this.status === 'trialing' || this.status === 'active') {
      return true
    }

    // Past due with 3-day grace period
    if (this.status === 'past_due' && this.currentPeriodEnd) {
      const graceEnd = this.currentPeriodEnd.plus({ days: Subscription.GRACE_PERIOD_DAYS })
      if (now < graceEnd) {
        return true
      }
    }

    // Canceled but not yet ended
    if (this.status === 'canceled' && this.endsAt) {
      if (now < this.endsAt) {
        return true
      }
    }

    return false
  }

  get isTrial(): boolean {
    return this.status === 'trialing'
  }

  toDTO(): SubscriptionDTO {
    return {
      id: this.id,
      status: this.status,
      isActive: this.isActive,
      isTrial: this.isTrial,
      trialEndsAt: this.trialEndsAt?.toISO() ?? null,
      currentPeriodEnd: this.currentPeriodEnd?.toISO() ?? null,
      canceledAt: this.canceledAt?.toISO() ?? null,
      endsAt: this.endsAt?.toISO() ?? null,
    }
  }
}
