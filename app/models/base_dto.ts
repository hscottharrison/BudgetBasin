export type UserDTO = {
  firstName: string
  lastName: string
}

export type SubscriptionStatusDTO = {
  isActive: boolean
  isTrial: boolean
  status: string
  trialEndsAt: string | null
  currentPeriodEnd: string | null
}

export interface BaseDTO {
  user: UserDTO | null
  subscription: SubscriptionStatusDTO | null
}
