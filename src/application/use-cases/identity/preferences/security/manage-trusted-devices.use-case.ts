import { Inject, Injectable } from '@nestjs/common';
import {
  ManageTrustedDevicesDto,
  TrustedDevicesResponseDto,
} from '@/application/dto/identity/preferences';
import { ISecurityRepository } from '@/domain/repositories/identity/preferences';

@Injectable()
export class ManageTrustedDevicesUseCase {
  constructor(
    @Inject('ISecurityRepository')
    private readonly securityRepository: ISecurityRepository,
  ) {}

  async execute(userId: string, dto: ManageTrustedDevicesDto): Promise<TrustedDevicesResponseDto> {
    const settings = await this.securityRepository.getSecuritySettings(userId);

    return {
      devices: [],
      maxDevices: dto.maxDevices,
      updatedAt: settings?.updatedAt ?? new Date(),
    };
  }
}
