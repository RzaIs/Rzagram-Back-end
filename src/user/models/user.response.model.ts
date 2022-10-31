import { User } from '@prisma/client'

export class UserResponseModel {
  id: string
  email: string
  username: string
  created: Date
  updated: Date

  constructor(user: User) {
    this.id = user.id
    this.email = user.email
    this.username = user.username
    this.created = user.created
    this.updated = user.updated
  }
}
