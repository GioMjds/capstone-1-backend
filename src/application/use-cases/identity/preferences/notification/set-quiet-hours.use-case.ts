import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  SetQuietHoursDto,
  QuietHoursResponseDto,
} from '@/application/dto/identity/preferences';
import { INotificationRepository } from '@/domain/repositories/identity/preferences';

@Injectable()
export class SetQuietHoursUseCase {
  constructor(
    @Inject('INotificationRepository')
    private readonly notificationRepository: INotificationRepository,
  ) {}

  async execute(userId: string, dto: SetQuietHoursDto): Promise<QuietHoursResponseDto> {
    await this.notificationRepository.updateQuietHours(
      userId,
      dto.enabled ? dto.startTime : null,
      dto.enabled ? dto.endTime : null,
    );

    return {
      enabled: dto.enabled,
      startTime: dto.startTime,
      endTime: dto.endTime,
      timezone: dto.timezone,
      daysOfWeek: dto.daysOfWeek,
      updatedAt: new Date(),
    };
  }
}
