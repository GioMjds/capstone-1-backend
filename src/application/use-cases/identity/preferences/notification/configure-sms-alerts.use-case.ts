import { Injectable } from '@nestjs/common';
import {
  ConfigureSmsAlertsDto,
  SmsAlertsResponseDto,
} from '@/application/dto/identity/preferences';

@Injectable()
export class ConfigureSmsAlertsUseCase {
  constructor() {}

  async execute(dto: ConfigureSmsAlertsDto): Promise<SmsAlertsResponseDto> {
    return {
      enabled: dto.enabled,
      phoneNumber: dto.phoneNumber,
      alertTypes: dto.alertTypes,
      updatedAt: new Date(),
    };
  }
}
