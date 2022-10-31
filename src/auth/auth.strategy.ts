import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { AuthGuard, PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { PrismaService } from 'src/prisma/prisma.service'
import { UserResponseModel } from 'src/user/models/user.response.model'

@Injectable()
export class AuthStrategy extends PassportStrategy(Strategy, 'jwt') {
  public static JwtGuard = AuthGuard('jwt')

  constructor(private prisma: PrismaService, config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('JWT_ACCESS_SECRET')
    })
  }

  async validate(payload: { sub: string }): Promise<UserResponseModel | undefined> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: payload.sub
      }
    })
    return user === null ? undefined : new UserResponseModel(user)
  }
}

@Injectable()
export class AuthRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  public static JwtGuard = AuthGuard('jwt-refresh')

  constructor(private prisma: PrismaService, config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromHeader('refresh-token'),
      secretOrKey: config.get('JWT_REFRESH_SECRET')
    })
  }

  async validate(payload: { sub: string }): Promise<UserResponseModel | undefined> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: payload.sub
      }
    })
    return user === null ? undefined : new UserResponseModel(user)
  }
}