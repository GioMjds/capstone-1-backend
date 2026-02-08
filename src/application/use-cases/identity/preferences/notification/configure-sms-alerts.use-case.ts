import { Inject, Injectable } from '@nestjs/common';
import {
  ConfigureSmsAlertsDto,
  SmsAlertsResponseDto,
} from '@/application/dto/identity/preferences';
import { INotificationRepository } from '@/domain/repositories/identity/preferences';

@Injectable()
export class ConfigureSmsAlertsUseCase {
  constructor(
    @Inject('INotificationRepository')
    private readonly notificationRepository: INotificationRepository,
  ) {}

  async execute(userId: string, dto: ConfigureSmsAlertsDto): Promise<SmsAlertsResponseDto> {
    await this.notificationRepository.updateNotificationSettings(userId, {
      smsAlerts: {
        enabled: dto.enabled,
        phoneNumber: dto.phoneNumber,
        alertTypes: dto.alertTypes ?? [],
      },
    });

    return {
      enabled: dto.enabled,
      phoneNumber: dto.phoneNumber,
      alertTypes: dto.alertTypes,
      updatedAt: new Date(),
    };
  }
}
