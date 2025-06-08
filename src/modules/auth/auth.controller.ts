import {Body, Controller, Post, UseGuards, Request, Get, Req} from '@nestjs/common';
import { AuthService } from './auth.service';
import {LoginLocalDto, RegisterDto} from './dto';
import {ApiBearerAuth, ApiTags} from '@nestjs/swagger';
import {LocalAuthGuard} from "./guards/local-auth.guard";
import {RefreshTokenDto} from "./dto/refresh.dto";
import {UserRoles} from "./decorators/roles.decorator";
import {UserRole} from "../users/enums";
import {JwtAuthGuard} from "./guards/jwt-auth.guard";
import {SystemRoleGuard} from "./guards/system-role.guard";
import {AuthUser} from "./decorators/auth-user.decorator";
import {AuthPayload} from "./types";

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
    };
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async localLogin(@Body() payload: LoginLocalDto, @Request() req) {
    return {
      message: 'Login user successfully',
      data: await this.authService.localLogin(req.user),
    }
  }


  @Post('refresh')
  async refreshToken(@Body() payload: RefreshTokenDto) {
    const data = await this.authService.jwtRefresh(payload.refresh_token);
    return {
      message: 'Login user successfully',
      data,
    };
  }

  @UseGuards(JwtAuthGuard)
  @UserRoles(UserRole.ADMIN)
  @Get('admin-test')
  getAdminTest(@Req() req: any) {
    console.log(req.user);
    // return { message: 'Admin Only' };
  }




}
