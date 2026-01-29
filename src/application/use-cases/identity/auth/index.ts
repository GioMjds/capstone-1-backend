export * from './login.use-case';
export * from './register.use-case';
export * from './verify-user.use-case';
export * from './resend-verification.use-case';
export * from './forgot-password-request.use-case';
export * from './forgot-password-verify.use-case';
export * from './forgot-password-reset.use-case';
export * from './change-password.use-case';

import { LoginUseCase } from './login.use-case';
import { RegisterUserUseCase } from './register.use-case';
import { VerifyUserUseCase } from './verify-user.use-case';
import { ResendVerificationUseCase } from './resend-verification.use-case';
import { ForgotPasswordRequestUseCase } from './forgot-password-request.use-case';
import { ForgotPasswordVerifyUseCase } from './forgot-password-verify.use-case';
import { ForgotPasswordResetUseCase } from './forgot-password-reset.use-case';
import { ChangePasswordUseCase } from './change-password.use-case';

// Important: To spread this array in module providers, use ...AUTH_USE_CASES
export const AUTH_USE_CASES = [
  LoginUseCase,
  RegisterUserUseCase,
  VerifyUserUseCase,
  ResendVerificationUseCase,
  ForgotPasswordRequestUseCase,
  ForgotPasswordVerifyUseCase,
  ForgotPasswordResetUseCase,
  ChangePasswordUseCase,
];
