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
import { JwtAuthGuard } from '@/shared/guards';
import {
  LoginUserDto,
  RegisterUserDto,
  VerifyUserDto,
  ResendVerificationDto,
  ChangePasswordDto,
  GoogleLoginOAuthDto,
  ForgotPasswordRequestDto,
  ForgotPasswordVerifyDto,
  ForgotPasswordResetDto,
} from '@/application/dto/auth';
import { ApiTags } from '@nestjs/swagger';
import {
  RegisterDocs,
  LoginDocs,
  LogoutDocs,
  VerifyEmailDocs,
  ResendVerificationDocs,
  GoogleOAuthLoginDocs,
  ChangePasswordDocs,
} from '@/shared/docs';
import { ConfigService } from '@nestjs/config';
import { Throttle } from '@nestjs/throttler';
import {
  LoginUseCase,
  RegisterUserUseCase,
  VerifyUserUseCase,
  ResendVerificationUseCase,
  ForgotPasswordRequestUseCase,
  ForgotPasswordResetUseCase,
  ForgotPasswordVerifyUseCase,
  ChangePasswordUseCase,
} from '@/application/use-cases/identity/auth';
import { CookieConfig } from '@/infrastructure/config/cookie.config';

@ApiTags('/auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly configService: ConfigService,
    private readonly loginUseCase: LoginUseCase,
    private readonly registerUserUseCase: RegisterUserUseCase,
    private readonly verifyUserUseCase: VerifyUserUseCase,
    private readonly resendVerificationUseCase: ResendVerificationUseCase,
    private readonly forgotPasswordRequestUseCase: ForgotPasswordRequestUseCase,
    private readonly forgotPasswordVerifyUseCase: ForgotPasswordVerifyUseCase,
    private readonly forgotPasswordResetUseCase: ForgotPasswordResetUseCase,
    private readonly changePasswordUseCase: ChangePasswordUseCase,
  ) {}

  @Post('login')
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @HttpCode(HttpStatus.OK)
  @LoginDocs()
  async login(
    @Body() dto: LoginUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.loginUseCase.execute(dto);
    this.setAuthCookie(res, result.accessToken);
    return result;
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @LogoutDocs()
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token');
  }

  @Post('register')
  @HttpCode(HttpStatus.OK)
  @RegisterDocs()
  register(@Body() dto: RegisterUserDto) {
    return this.registerUserUseCase.execute(dto);
  }

  @Post('verify-email')
  @HttpCode(HttpStatus.CREATED)
  @VerifyEmailDocs()
  async verifyEmail(
    @Body() dto: VerifyUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.verifyUserUseCase.execute(dto);
    this.setAuthCookie(res, result.accessToken);
    return result;
  }

  @Post('resend-verif')
  @HttpCode(HttpStatus.OK)
  @ResendVerificationDocs()
  resendVerificationEmail(@Body() dto: ResendVerificationDto) {
    return this.resendVerificationUseCase.execute(dto);
  }

  @Post('forgot-password-request')
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @HttpCode(HttpStatus.OK)
  // @ForgotPasswordRequestDocs() // Add this decorator in your docus
  async forgotPasswordRequest(@Body() dto: ForgotPasswordRequestDto) {
    return this.forgotPasswordRequestUseCase.execute(dto);
  }

  @Post('forgot-password-verify')
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @HttpCode(HttpStatus.OK)
  // @ForgotPasswordVerifyDocs() // Add this decorator in your docus
  async forgotPasswordVerify(@Body() dto: ForgotPasswordVerifyDto) {
    return this.forgotPasswordVerifyUseCase.execute(dto);
  }

  @Post('forgot-password-reset')
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @HttpCode(HttpStatus.OK)
  // @ForgotPasswordResetDocs() // Add this decorator in your docus
  async forgotPasswordReset(@Body() dto: ForgotPasswordResetDto) {
    return this.forgotPasswordResetUseCase.execute(dto);
  }

  @Post('change-password')
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ChangePasswordDocs()
  changePassword(@Body() dto: ChangePasswordDto) {
    return this.changePasswordUseCase.execute(dto);
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

  // @Post('google-login')
  // @HttpCode(HttpStatus.OK)
  // @GoogleOAuthLoginDocs()
  // googleOAuthLogin(@Body() dto: GoogleLoginOAuthDto) {
  //   return this.authService.googleAuth(dto);
  // }
}
