import { Body, Controller, Post, UseGuards, Req, Get, Res, UnauthorizedException } from '@nestjs/common'
import { AuthService } from './auth.service'
import { LoginLocalDto, RegisterDto } from './dto'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { RefreshTokenDto } from './dto/refresh.dto'
import { LocalAuthGuard } from './guards'
import {Request} from 'express'
import { AuthGuard } from '@nestjs/passport'


@Controller('auth')
@ApiTags('Auth')
@ApiBearerAuth()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async localRegister(@Body() payload: RegisterDto) {
    return {
      message: 'Register user successfully',
      data: await this.authService.localRegister(payload),
    }
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async localLogin(@Body() payload: LoginLocalDto, @Req() req: Request) {
    return {
      message: 'Login user successfully',
      data: await this.authService.localLogin(req.user),
    }
  }

  @Post('refresh')
  async refreshToken(@Body() payload: RefreshTokenDto) {
    const data = await this.authService.jwtRefresh(payload.refresh_token)
    return {
      message: 'Login user successfully',
      data,
    }
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async auth (){
  }

  @UseGuards(AuthGuard('google'))
  @Get('google-redirect')
  async googleCallback(@Req() req) {
    if (!req.user)
      throw new UnauthorizedException('Google authentication failed')

    return req.user
  }
}
