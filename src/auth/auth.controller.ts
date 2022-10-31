import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  UseGuards,
} from '@nestjs/common'
import { UserResponseModel } from 'src/user/models/user.response.model'
import { GetUser } from './auth.decorators'
import { AuthServiceAC } from './auth.service'
import { AuthRefreshStrategy } from './auth.strategy'
import { PublicKeyModel } from './models/public.key.model'
import { TokenModel } from './models/token.model'
import { UserAuthModel } from './models/user.auth.model'
import { UserCreateModel } from './models/user.create.model'

@Controller('auth')
export class AuthController {
  constructor(@Inject(AuthServiceAC) private service: AuthServiceAC) {}

  @Get('rsa-key')
  publicKey(): Promise<PublicKeyModel> {
    return this.service.generatePublicKey()
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Body() credentials: UserAuthModel): Promise<TokenModel> {
    return this.service.login(credentials)
  }

  @Post('register')
  register(@Body() credentials: UserCreateModel): Promise<TokenModel> {
    return this.service.register(credentials)
  }

  @UseGuards(AuthRefreshStrategy.JwtGuard)
  @Get('refresh-token')
  refreshToken(@GetUser() user: UserResponseModel) {
    return this.service.refreshTokens(user.id, user.email)
  }
}
