import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from 'src/guards';
import {
  LoginUserDto,
  RegisterUserDto,
  VerifyUserDto,
  ResendVerificationDto,
  ChangePasswordDto,
} from './dto';
import { ApiTags } from '@nestjs/swagger';
import { GoogleLoginOAuthDto } from './dto/oauth.dto';
import {
  RegisterDocs,
  LoginDocs,
  LogoutDocs,
  VerifyEmailDocs,
  ResendVerificationDocs,
  GoogleOAuthLoginDocs,
  ChangePasswordDocs,
} from '@/docus';
import { ConfigService } from '@nestjs/config';
import { Throttle } from '@nestjs/throttler';

@ApiTags('/auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Post('login')
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @HttpCode(HttpStatus.OK)
  @LoginDocs()
  async login(
    @Body() dto: LoginUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.login(dto);
    res.cookie('access_token', result.access_token, {
      sameSite: 'none',
      secure: this.configService.get('NODE_ENV') === 'production',
      httpOnly: true,
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return result;
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @LogoutDocs()
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token');
    return this.authService.logout();
  }

  @Post('register')
  @HttpCode(HttpStatus.OK)
  @RegisterDocs()
  register(@Body() dto: RegisterUserDto) {
    return this.authService.register(dto);
  }

  @Post('verify-email')
  @HttpCode(HttpStatus.CREATED)
  @VerifyEmailDocs()
  async verifyEmail(
    @Body() dto: VerifyUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.verifyUser(dto);
    res.cookie('access_token', result.access_token, {
      sameSite: 'none',
      secure: this.configService.get('NODE_ENV') === 'production',
      httpOnly: true,
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return result;
  }

  @Post('resend-verif')
  @HttpCode(HttpStatus.OK)
  @ResendVerificationDocs()
  resendVerificationEmail(@Body() dto: ResendVerificationDto) {
    return this.authService.resendEmail(dto);
  }

  @Post('change-password')
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ChangePasswordDocs()
  changePassword(@Body() dto: ChangePasswordDto) {
    return this.authService.changePassword(dto);
  }

  @Post('google-login')
  @HttpCode(HttpStatus.OK)
  @GoogleOAuthLoginDocs()
  googleOAuthLogin(@Body() dto: GoogleLoginOAuthDto) {
    return this.authService.googleAuth(dto.idToken);
  }
}
