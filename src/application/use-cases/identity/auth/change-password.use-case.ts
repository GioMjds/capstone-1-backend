import { Injectable, Inject, NotFoundException, BadRequestException } from "@nestjs/common";
import { ChangePasswordDto } from "@/application/dto/identity/auth";
import type { IUserRepository } from "@/domain/repositories";
import { EmailValueObject, PasswordValueObject } from "@/domain/value-objects/identity";

@Injectable()
export class ChangePasswordUseCase {
  constructor(
    @Inject("IUserRepository")
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(dto: ChangePasswordDto): Promise<{ message: string }> {
    const email = new EmailValueObject(dto.email);
    const user = await this.userRepository.findByEmail(email);
    if (!user) throw new NotFoundException("User not found");

    if (dto.newPassword !== dto.confirmNewPassword) {
      throw new NotFoundException("New password and confirmation do not match");
    }

    const isSamePassword = await user.verifyPassword(dto.newPassword);
    if (isSamePassword) throw new BadRequestException("New password must be different from current password");

    const newPasswordVo = await PasswordValueObject.fromPlainText(dto.newPassword);
    await user.updatePassword(newPasswordVo);
    await this.userRepository.save(user);

    return { message: "Password changed successfully" };
  }
}