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
} from './dto';
import { ApiTags } from '@nestjs/swagger';
import { GoogleLoginOAuthDto } from './dto/oauth.dto';
import { 
  RegisterDocs, 
  LoginDocs, 
  LogoutDocs, 
  VerifyEmailDocs, 
  ResendVerificationDocs, 
  GoogleOAuthLoginDocs 
} from '@/docus';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @LoginDocs()
  login(@Body() dto: LoginUserDto, @Res({ passthrough: true }) res: Response) {
    return this.authService.login(dto, res);
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
    return this.authService.register(dto);
  }

  @Post('verify-email')
  @HttpCode(HttpStatus.CREATED)
  @VerifyEmailDocs()
  verifyEmail(
    @Body() dto: VerifyUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.verifyUser(dto, res);
  }

  @Post('resend-verif')
  @HttpCode(HttpStatus.OK)
  @ResendVerificationDocs()
  resendVerificationEmail(@Body() dto: ResendVerificationDto) {
    return this.authService.resendEmail(dto);
  }

  @Post('google-login')
  @HttpCode(HttpStatus.OK)
  @GoogleOAuthLoginDocs()
  googleOAuthLogin(@Body() dto: GoogleLoginOAuthDto) {
    return this.authService.googleAuth(dto.idToken);
  }
}
