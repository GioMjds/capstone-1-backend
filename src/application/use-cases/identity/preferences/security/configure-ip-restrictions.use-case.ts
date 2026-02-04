import { Injectable } from '@nestjs/common';
import {
  ConfigureIpRestrictionsDto,
  IpRestrictionsResponseDto,
} from '@/application/dto/identity/preferences';

@Injectable()
export class ConfigureIpRestrictionsUseCase {
  constructor() {}

  async execute(dto: ConfigureIpRestrictionsDto): Promise<IpRestrictionsResponseDto> {
    return {
      enabled: dto.enabled,
      allowedIps: dto.allowedIps,
      blockedIps: dto.blockedIps,
      updatedAt: new Date(),
    };
  }
}
