import { Inject, Injectable } from '@nestjs/common';
import {
  ConfigureIpRestrictionsDto,
  IpRestrictionsResponseDto,
} from '@/application/dto/identity/preferences';
import { ISecurityRepository } from '@/domain/repositories/identity/preferences';

@Injectable()
export class ConfigureIpRestrictionsUseCase {
  constructor(
    @Inject('ISecurityRepository')
    private readonly securityRepository: ISecurityRepository,
  ) {}

  async execute(userId: string, dto: ConfigureIpRestrictionsDto): Promise<IpRestrictionsResponseDto> {
    await this.securityRepository.updateSecuritySettings(userId, {
      ipRestrictions: {
        enabled: dto.enabled,
        allowedIps: dto.allowedIps,
        blockedIps: dto.blockedIps,
      },
    });

    return {
      enabled: dto.enabled,
      allowedIps: dto.allowedIps,
      blockedIps: dto.blockedIps,
      updatedAt: new Date(),
    };
  }
}
