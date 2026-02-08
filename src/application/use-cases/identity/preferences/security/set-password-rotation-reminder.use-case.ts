import { Inject, Injectable } from '@nestjs/common';
import {
  SetPasswordRotationReminderDto,
  SetPasswordRotationReminderResponseDto,
} from '@/application/dto/identity/preferences';
import { ISecurityRepository } from '@/domain/repositories/identity/preferences';

@Injectable()
export class SetPasswordRotationReminderUseCase {
  constructor(
    @Inject('ISecurityRepository')
    private readonly securityRepository: ISecurityRepository,
  ) {}

  async execute(userId: string, dto: SetPasswordRotationReminderDto): Promise<SetPasswordRotationReminderResponseDto> {
    const expirationDays = dto.passwordExpirationDays ?? 90;

    await this.securityRepository.updateSecuritySettings(userId, {
      passwordRotationReminder: {
        reminderDaysBeforeExpiry: dto.reminderDaysBeforeExpiry ?? 14,
        passwordExpirationDays: expirationDays,
      },
    });

    return {
      id: userId,
      reminderDaysBeforeExpiry: dto.reminderDaysBeforeExpiry ?? 14,
      passwordExpirationDays: expirationDays,
      lastChangedAt: new Date(),
      nextExpirationAt: new Date(Date.now() + expirationDays * 24 * 3600000),
      updatedAt: new Date(),
    };
  }
}
