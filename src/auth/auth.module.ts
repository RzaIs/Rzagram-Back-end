import { Module } from '@nestjs/common'
import { AuthService, AuthServiceAC } from './auth.service'
import { AuthController } from './auth.controller'
import { JwtModule } from '@nestjs/jwt'
import { AuthRefreshStrategy, AuthStrategy } from './auth.strategy'
import { AuthRSAService } from './auth.rsa'

@Module({
  imports: [JwtModule.register({})],
  controllers: [AuthController],
  providers: [
    {
      provide: AuthServiceAC,
      useClass: AuthService,
    },
    AuthRSAService,
    AuthStrategy,
    AuthRefreshStrategy
  ],
})
export class AuthModule {}
