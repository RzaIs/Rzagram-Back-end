import { Controller, Get, Inject, Param, UseGuards } from '@nestjs/common'
import { User } from '@prisma/client'
import { GetUser } from 'src/auth/auth.decorators'
import { AuthStrategy } from 'src/auth/auth.strategy'
import { UserResponseModel } from './models/user.response.model'
import { UserServiceAC } from './user.service'

@UseGuards(AuthStrategy.JwtGuard)
@Controller('user')
export class UserController {
  constructor(@Inject(UserServiceAC) private service: UserServiceAC) {}

  @Get('me')
  getSelfUser(@GetUser() user: UserResponseModel): UserResponseModel {
    return user
  }

  @Get('username/:username')
  getUserByUsername(@Param('username') username: string): Promise<UserResponseModel> {
    return this.service.getUserByUsername(username)
  }

  @Get('id/:id')
  getUserByID(@Param('id') id: string): Promise<UserResponseModel> {
    return this.service.getUserByID(id)
  }
}
