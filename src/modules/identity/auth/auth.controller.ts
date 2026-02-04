import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Throttle } from '@nestjs/throttler';
import { ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';
import { CookieConfig } from '@/infrastructure/config';
import { JwtAuthGuard } from '@/shared/guards';
import { CurrentUser, JwtPayload } from '@/shared/decorators';
import * as AuthDto from '@/application/dto/identity/auth';
import * as AuthDocs from '@/shared/docs';
import * as AuthUseCase from '@/application/use-cases/identity/auth';

@ApiTags('/auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly configService: ConfigService,
    private readonly loginUse: AuthUseCase.LoginUseCase,
    private readonly registerUse: AuthUseCase.RegisterUserUseCase,
    private readonly verifyUserUse: AuthUseCase.VerifyUserUseCase,
    private readonly resendVerificationUse: AuthUseCase.ResendVerificationUseCase,
    private readonly forgotPasswordRequestUse: AuthUseCase.ForgotPasswordRequestUseCase,
    private readonly forgotPasswordVerifyUse: AuthUseCase.ForgotPasswordVerifyUseCase,
    private readonly forgotPasswordResetUse: AuthUseCase.ForgotPasswordResetUseCase,
    private readonly changePasswordUse: AuthUseCase.ChangePasswordUseCase,
    private readonly googleOAuthUse: AuthUseCase.GoogleOAuthUseCase,
    private readonly getCurrentUserUse: AuthUseCase.GetCurrentUserUseCase,
  ) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async getCurrentUser(@CurrentUser() user: JwtPayload) {
    return await this.getCurrentUserUse.execute(user.sub);
  }

  @Post('login')
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @HttpCode(HttpStatus.OK)
  @AuthDocs.LoginDocs()
  async login(
    @Body() dto: AuthDto.LoginUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.loginUse.execute(dto);
    this.setAuthCookie(res, result.accessToken);
    return result;
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @AuthDocs.LogoutDocs()
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token');
  }

  @Post('register')
  @HttpCode(HttpStatus.OK)
  @AuthDocs.RegisterDocs()
  register(@Body() dto: AuthDto.RegisterUserDto) {
    return this.registerUse.execute(dto);
  }

  @Post('verify-email')
  @HttpCode(HttpStatus.CREATED)
  @AuthDocs.VerifyEmailDocs()
  async verifyEmail(
    @Body() dto: AuthDto.VerifyUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.verifyUserUse.execute(dto);
    this.setAuthCookie(res, result.accessToken);
    return result;
  }

  @Post('resend-verif')
  @Throttle({ default: { limit: 1, ttl: 120000 } })
  @HttpCode(HttpStatus.OK)
  @AuthDocs.ResendVerificationDocs()
  resendVerificationEmail(@Body() dto: AuthDto.ResendVerificationDto) {
    return this.resendVerificationUse.execute(dto);
  }

  @Post('forgot-password-request')
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @HttpCode(HttpStatus.OK)
  @AuthDocs.ForgotPasswordRequestDocs()
  async forgotPasswordRequest(@Body() dto: AuthDto.ForgotPasswordRequestDto) {
    return this.forgotPasswordRequestUse.execute(dto);
  }

  @Post('forgot-password-verify')
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @HttpCode(HttpStatus.OK)
  @AuthDocs.ForgotPasswordVerifyDocs()
  async forgotPasswordVerify(@Body() dto: AuthDto.ForgotPasswordVerifyDto) {
    return this.forgotPasswordVerifyUse.execute(dto);
  }

  @Post('forgot-password-reset')
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @HttpCode(HttpStatus.OK)
  @AuthDocs.ForgotPasswordResetDocs()
  async forgotPasswordReset(@Body() dto: AuthDto.ForgotPasswordResetDto) {
    return this.forgotPasswordResetUse.execute(dto);
  }

  @Post('change-password')
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @AuthDocs.ChangePasswordDocs()
  changePassword(@Body() dto: AuthDto.ChangePasswordDto) {
    return this.changePasswordUse.execute(dto);
  }

  @Post('google-login')
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @HttpCode(HttpStatus.OK)
  @AuthDocs.GoogleOAuthLoginDocs()
  googleOAuthLogin(@Body() dto: AuthDto.GoogleLoginOAuthDto) {
    return this.googleOAuthUse.execute(dto);
  }

  private setAuthCookie(res: Response, token: string): void {
    const isProduction =
      this.configService.get<string>('NODE_ENV') === 'production';
    res.cookie(
      CookieConfig.AUTH_COOKIE_NAME,
      token,
      CookieConfig.getAuthCookieOptions(isProduction),
    );
  }
}
