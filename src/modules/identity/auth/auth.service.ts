import { Injectable } from '@nestjs/common';
import {
  LoginUserDto,
  ChangePasswordDto,
  ForgotPasswordRequestDto,
  ForgotPasswordResetDto,
  ForgotPasswordVerifyDto,
  GoogleLoginOAuthDto,
  RegisterUserDto,
  ResendVerificationDto,
  VerifyUserDto,
} from '@/application/dto/auth';
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

@Injectable()
export class AuthService {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly registerUserUseCase: RegisterUserUseCase,
    private readonly verifyUserUse: VerifyUserUseCase,
    private readonly resendVerificationUseCase: ResendVerificationUseCase,
    private readonly forgotPasswordRequestUseCase: ForgotPasswordRequestUseCase,
    private readonly forgotPasswordVerifyUseCase: ForgotPasswordVerifyUseCase,
    private readonly forgotPasswordResetUseCase: ForgotPasswordResetUseCase,
    private readonly changePasswordUseCase: ChangePasswordUseCase,
  ) {}

  async logout() {
    return { message: 'Logout successful' };
  }

  async login(dto: LoginUserDto) {
    return await this.loginUseCase.execute(dto);
  }

  async register(dto: RegisterUserDto) {
    return await this.registerUserUseCase.execute(dto);
  }

  async verifyUser(dto: VerifyUserDto) {
    return await this.verifyUserUse.execute(dto);
  }

  async resendEmailVerification(dto: ResendVerificationDto) {
    return await this.resendVerificationUseCase.execute(dto);
  }

  async forgotPasswordRequest(dto: ForgotPasswordRequestDto) {
    return await this.forgotPasswordRequestUseCase.execute(dto);
  }

  async forgotPasswordVerify(dto: ForgotPasswordVerifyDto) {
    return await this.forgotPasswordVerifyUseCase.execute(dto);
  }

  async forgotPasswordReset(dto: ForgotPasswordResetDto) {
    return await this.forgotPasswordResetUseCase.execute(dto);
  }

  async changePassword(dto: ChangePasswordDto) {
    return await this.changePasswordUseCase.execute(dto);
  }
}
