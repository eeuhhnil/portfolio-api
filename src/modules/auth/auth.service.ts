import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { UserService } from '../users/user.service'
import { RegisterDto } from './dto'
import * as bcrypt from 'bcrypt'
import { AuthPayload, JwtSign } from './types'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwt: JwtService,
    private readonly configService: ConfigService,
  ) {}
  async localRegister(payload: RegisterDto) {
    const existingEmail = await this.userService.checkExisting(
        {email: payload.email},
    )

    if (existingEmail) {
      throw new ConflictException('Email already exist')
    }

    const { password, ...subPayload } = payload


    const newUser = await this.userService.create({
      hashedPassword: bcrypt.hashSync(password, 10),
      ...subPayload,
    })

    const { hashedPassword: _, ...user } = newUser.toJSON()

    return user
  }

  async localLogin(user: any) {
    const payload: AuthPayload = {
      sub: user._id.toString(),
      email: user.email,
      role: user.role,
    }
    return this.jwtSign(payload)
  }

  private jwtSign(payload: AuthPayload): JwtSign {
    return {
      access_token: this.jwt.sign(payload),
      refresh_token: this.jwtSignRefresh(payload),
    }
  }

  async jwtRefresh(refresh: string): Promise<JwtSign> {
    const payload = this.jwt.verify(refresh, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
    })

    const user = await this.userService.findOne({ _id: payload.sub })

    if (!user) {
      throw new NotFoundException('User does not exist')
    }

    const authPayload: AuthPayload = {
      sub: user._id.toString(),
      email: user.email,
      role: user.role!,
    }
    return this.jwtSign(authPayload)
  }

  private jwtSignRefresh(payload: AuthPayload): string {
    return this.jwt.sign(
      { sub: payload.sub },
      {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: '7d',
      },
    )
  }

  async validateGoogleUser(payload: {
    email: string,
    fullName: string,
    avatar?: string,
    googleId: string
  })
  {
    let user = await this.userService.findOne({ email: payload.email })

    if (!user) {
      user = await this.userService.create({
        email: payload.email,
        fullName: payload.fullName,
        avatar: payload.avatar
      })
    }
  else if(!user.googleId) {
    user.googleId = payload.googleId
      await user.save()
    }

    if (!user.role) {
      throw new Error('User role is missing');
    }

    return this.jwtSign({ sub: user._id.toString(), email: user.email, role: user.role})
  }
}


