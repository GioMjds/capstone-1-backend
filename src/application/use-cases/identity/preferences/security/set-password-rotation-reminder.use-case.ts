import { Injectable } from '@nestjs/common';
import {
  SetPasswordRotationReminderDto,
  SetPasswordRotationReminderResponseDto,
} from '@/application/dto/identity/preferences';

@Injectable()
export class SetPasswordRotationReminderUseCase {
  constructor() {}

  async execute(dto: SetPasswordRotationReminderDto): Promise<SetPasswordRotationReminderResponseDto> {
    const expirationDays = dto.passwordExpirationDays ?? 90;
    return {
      id: 'password-rotation-123',
      reminderDaysBeforeExpiry: dto.reminderDaysBeforeExpiry ?? 14,
      passwordExpirationDays: expirationDays,
      lastChangedAt: new Date(),
      nextExpirationAt: new Date(Date.now() + expirationDays * 24 * 3600000),
      updatedAt: new Date(),
    };
  }
}
