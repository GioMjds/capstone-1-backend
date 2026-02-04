import { Injectable } from '@nestjs/common';
import {
  ConfigureSuspiciousActivityAlertsDto,
  SuspiciousActivityAlertsResponseDto,
} from '@/application/dto/identity/preferences';

@Injectable()
export class ConfigureSuspiciousActivityAlertsUseCase {
  constructor() {}

  async execute(dto: ConfigureSuspiciousActivityAlertsDto): Promise<SuspiciousActivityAlertsResponseDto> {
    return {
      enabled: dto.enabled,
      alertTypes: dto.alertTypes,
      notificationChannels: dto.notificationChannels,
      updatedAt: new Date(),
    };
  }
}
