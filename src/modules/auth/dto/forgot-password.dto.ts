import { IsPasswordMatch, IsPasswordValid } from "@/decorators";
import { IsEmail, IsString } from "class-validator";

export class ForgotPasswordRequestDto {
  @IsEmail()
  email: string;
}

export class ForgotPasswordVerifyDto {
  @IsEmail()
  email: string;

  @IsString()
  otp: string;
}

export class ForgotPasswordResetDto {
  @IsEmail()
  email: string;
  @IsString()
  otp: string;

  @IsPasswordValid()
  newPassword: string;

  @IsPasswordMatch('newPassword')
  confirmNewPassword: string;
}