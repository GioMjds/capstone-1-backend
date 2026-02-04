import { Injectable } from '@nestjs/common';
import {
  ManageTrustedDevicesDto,
  TrustedDevicesResponseDto,
} from '@/application/dto/identity/preferences';

@Injectable()
export class ManageTrustedDevicesUseCase {
  constructor() {}

  async execute(dto: ManageTrustedDevicesDto): Promise<TrustedDevicesResponseDto> {
    return {
      devices: [],
      maxDevices: dto.maxDevices,
      updatedAt: new Date(),
    };
  }
}
