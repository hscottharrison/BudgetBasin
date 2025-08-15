export type UserDTO = {
  firstName: string
  lastName: string
}

export interface BaseDTO {
  user: UserDTO | null
}
