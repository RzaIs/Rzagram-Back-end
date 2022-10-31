import { ForbiddenException, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime'
import { hash, verify } from 'argon2'
import { PrismaService } from 'src/prisma/prisma.service'
import { AuthRSAService } from './auth.rsa'
import { PublicKeyModel } from './models/public.key.model'
import { TokenModel } from './models/token.model'
import { UserAuthModel } from './models/user.auth.model'
import { UserCreateModel } from './models/user.create.model'

export abstract class AuthServiceAC {
  abstract generatePublicKey(): Promise<PublicKeyModel>
  abstract login(credentials: UserAuthModel): Promise<TokenModel>
  abstract register(credentials: UserCreateModel): Promise<TokenModel>
  abstract refreshTokens(userID: string, email: string): Promise<TokenModel>
}

@Injectable()
export class AuthService implements AuthServiceAC {
  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
    private jwt: JwtService,
    private authRSAService: AuthRSAService
  ) {}

  async generatePublicKey(): Promise<PublicKeyModel> {
    const { publicKey, privateKey } = this.authRSAService.generateKeys()
    const keyPair = await this.prisma.privateKey.create({
      data: { privateKey }
    })
    this.clearOldKeys().then(() => {
      console.log('✅ Old Keys Have Been Successfully Removed ✅')
    }).catch((error) => {
      console.log('⛔️ An Error Occured While Clearing Old Keys ⛔️')
    })
    return new PublicKeyModel(keyPair.id, publicKey)
  }

  async clearOldKeys(): Promise<void> {
    const date = new Date()
    date.setSeconds(date.getSeconds() - 60)
    await this.prisma.privateKey.deleteMany({
      where: {
        created: {
          lte: new Date(date)
        }
      }
    })
  }

  async login(credentials: UserAuthModel): Promise<TokenModel> {
    const [user, keyData] = await Promise.all([
      this.prisma.user.findUnique({
        where: {
          username: credentials.username
        }
      }),
      this.prisma.privateKey.findUnique({
        where: {
          id: credentials.keyID
        }
      })
    ])

    if (user === null || keyData === null) {
      throw new ForbiddenException('Incorrect credentials')
    }

    const password = this.authRSAService.decrypt(
      credentials.encryptedPassword,
      keyData.privateKey
    )

    if (!(await verify(user.passwordHash, password))) {
      throw new ForbiddenException('Incorrect credentials')
    }

    const [accessToken, refreshToken] = await Promise.all([
      this.generateAccessToken(user.id, user.email),
      this.generateRefreshToken(user.id, user.email)
    ])

    return new TokenModel(accessToken, refreshToken)
  }

  async register(credentials: UserCreateModel): Promise<TokenModel> {
    const keyData = await this.prisma.privateKey.findUnique({
      where: {
        id: credentials.keyID
      }
    })

    if (keyData === null) {
      throw new ForbiddenException('Session timeout')
    }

    const password = this.authRSAService.decrypt(
      credentials.encryptedPassword,
      keyData.privateKey
    )

    const passwordHash = await hash(password)
    try {
      const user = await this.prisma.user.create({
        data: {
          email: credentials.email,
          username: credentials.username,
          passwordHash: passwordHash
        }
      })

      const [accessToken, refreshToken] = await Promise.all([
        this.generateAccessToken(user.id, user.email),
        this.generateRefreshToken(user.id, user.email)
      ])

      return new TokenModel(accessToken, refreshToken)

    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ForbiddenException('Credentials are already taken!')
      } else {
        throw error
      }
    }
  }

  async refreshTokens(userID: string, email: string): Promise<TokenModel> {
    const [accessToken, refreshToken] = await Promise.all([
      this.generateAccessToken(userID, email),
      this.generateRefreshToken(userID, email)
    ])
    return new TokenModel(accessToken, refreshToken)
  }

  async generateAccessToken(userID: string, email: string): Promise<string> {
    const token = await this.jwt.signAsync(
      {
        sub: userID,
        email: email
      },
      {
        expiresIn: '72h',
        secret: this.config.get('JWT_ACCESS_SECRET')
      }
    )
    return token
  }

  async generateRefreshToken(userID: string, email: string): Promise<string> {
    const token = await this.jwt.signAsync(
      {
        sub: userID,
        email: email
      },
      {
        expiresIn: '72 days',
        secret: this.config.get('JWT_REFRESH_SECRET')
      }
    )
    return token
  }
}
