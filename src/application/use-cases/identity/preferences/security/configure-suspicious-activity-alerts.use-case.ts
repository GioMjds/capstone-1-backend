import { Inject, Injectable } from '@nestjs/common';
import {
  ConfigureSuspiciousActivityAlertsDto,
  SuspiciousActivityAlertsResponseDto,
} from '@/application/dto/identity/preferences';
import { ISecurityRepository } from '@/domain/repositories/identity/preferences';

@Injectable()
export class ConfigureSuspiciousActivityAlertsUseCase {
  constructor(
    @Inject('ISecurityRepository')
    private readonly securityRepository: ISecurityRepository,
  ) {}

  async execute(userId: string, dto: ConfigureSuspiciousActivityAlertsDto): Promise<SuspiciousActivityAlertsResponseDto> {
    await this.securityRepository.updateSecuritySettings(userId, {
      suspiciousActivityAlerts: {
        enabled: dto.enabled,
        alertTypes: dto.alertTypes,
        notificationChannels: dto.notificationChannels,
      },
    });

    return {
      enabled: dto.enabled,
      alertTypes: dto.alertTypes,
      notificationChannels: dto.notificationChannels,
      updatedAt: new Date(),
    };
  }
}
