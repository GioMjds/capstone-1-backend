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

@ApiTags('/auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() dto: LoginUserDto) {
    return this.authService.login(dto);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token');
  }

  @Post('register')
  @HttpCode(HttpStatus.OK)
  register(@Body() dto: RegisterUserDto) {
    return this.authService.register(dto);
  }

  @Post('verify-email')
  @HttpCode(HttpStatus.OK)
  verifyEmail(@Body() dto: VerifyUserDto) {
    return this.authService.verifyUser(dto);
  }

  @Post('resend-verif')
  @HttpCode(HttpStatus.OK)
  resendVerificationEmail(@Body() dto: ResendVerificationDto) {
    return this.authService.resendEmail(dto);
  }
}
