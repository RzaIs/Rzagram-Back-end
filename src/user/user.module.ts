import { Module } from '@nestjs/common'
import { UserController } from './user.controller'
import { UserService, UserServiceAC } from './user.service'

@Module({
  controllers: [UserController],
  providers: [
    {
      provide: UserServiceAC,
      useClass: UserService
    }
  ]
})
export class UserModule {}
