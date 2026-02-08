import { Inject, Injectable } from '@nestjs/common';
import {
  ConfigureLoginAlertsDto,
  LoginAlertsResponseDto,
} from '@/application/dto/identity/preferences';
import { ISecurityRepository } from '@/domain/repositories/identity/preferences';

@Injectable()
export class ConfigureLoginAlertsUseCase {
  constructor(
    @Inject('ISecurityRepository')
    private readonly securityRepository: ISecurityRepository,
  ) {}

  async execute(userId: string, dto: ConfigureLoginAlertsDto): Promise<LoginAlertsResponseDto> {
    await this.securityRepository.updateSecuritySettings(userId, {
      loginAlerts: {
        emailAlerts: dto.emailAlerts,
        smsAlerts: dto.smsAlerts,
        pushAlerts: dto.pushAlerts,
        alertOnNewDevice: dto.alertOnNewDevice,
        alertOnNewLocation: dto.alertOnNewLocation,
      },
    });

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
