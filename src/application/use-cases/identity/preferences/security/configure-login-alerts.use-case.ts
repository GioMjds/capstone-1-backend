import { Injectable } from '@nestjs/common';
import {
  ConfigureLoginAlertsDto,
  LoginAlertsResponseDto,
} from '@/application/dto/identity/preferences';

@Injectable()
export class ConfigureLoginAlertsUseCase {
  constructor() {}

  async execute(dto: ConfigureLoginAlertsDto): Promise<LoginAlertsResponseDto> {
    return {
      emailAlerts: dto.emailAlerts,
      smsAlerts: dto.smsAlerts,
      pushAlerts: dto.pushAlerts,
      alertOnNewDevice: dto.alertOnNewDevice,
      alertOnNewLocation: dto.alertOnNewLocation,
      updatedAt: new Date(),
    };
  }
}
