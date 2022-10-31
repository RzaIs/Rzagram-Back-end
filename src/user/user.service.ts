import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { UserResponseModel } from './models/user.response.model'

export abstract class UserServiceAC {
  abstract getUserByUsername(username: string): Promise<UserResponseModel>
  abstract getUserByID(id: string): Promise<UserResponseModel>
}

@Injectable()
export class UserService implements UserServiceAC {
  constructor(private prisma: PrismaService) {}

  async getUserByUsername(username: string): Promise<UserResponseModel> {
    const user = await this.prisma.user.findUnique({
      where: { username }
    })

    if (user !== null) {
      return new UserResponseModel(user)
    } else {
      throw new NotFoundException('User with specified username does not exist!')
    }
  }

  async getUserByID(id: string): Promise<UserResponseModel> {
    const user = await this.prisma.user.findUnique({
      where: { id }
    })

    if (user !== null) {
      return new UserResponseModel(user)
    } else {
      throw new NotFoundException('User with specified username does not exist!')
    }
  }
}
