import { Injectable, Inject } from '@nestjs/common';
import { SecuritySettingsResponseDto } from '@/application/dto/identity/preferences';
import { ISecurityRepository } from '@/domain/repositories/identity/preferences';

@Injectable()
export class GetSecuritySettingsUseCase {
  constructor(
    @Inject('ISecurityRepository')
    private readonly securityRepository: ISecurityRepository,
  ) {}

  async execute(userId: string): Promise<SecuritySettingsResponseDto> {
    const settings = await this.securityRepository.getSecuritySettings(userId);

    if (!settings) {
      return {
        twoFactorEnabled: false,
        twoFactorMethod: '',
        passkeysEnabled: false,
        passwordChangedAt: new Date(),
        activeSessions: [],
        trustedDevices: [],
      };
    }

    return {
      twoFactorEnabled: settings.twoFactorEnabled,
      twoFactorMethod: settings.twoFactorMethod ?? '',
      passkeysEnabled: settings.passkeysEnabled,
      passwordChangedAt: settings.passwordChangedAt ?? new Date(),
      activeSessions: [],
      trustedDevices: [],
    };
  }
}
