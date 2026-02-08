import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateSecuritySettingsDto } from '@/application/dto/identity/preferences/security/update-security-settings.dto';
import { SecuritySettingsResponseDto } from '@/application/dto/identity/preferences';
import { ISecurityRepository } from '@/domain/repositories/identity/preferences';
import { InvalidStateException } from '@/shared/exceptions';

@Injectable()
export class UpdateSecuritySettingsUseCase {
  constructor(
    @Inject('ISecurityRepository')
    private readonly securityRepository: ISecurityRepository,
  ) {}

  async execute(
    userId: string,
    dto: UpdateSecuritySettingsDto,
  ): Promise<SecuritySettingsResponseDto> {
    if (dto.twoFactorEnabled && !dto.twoFactorMethod) {
      throw new InvalidStateException(
        '2FA method must be specified when enabling 2FA',
      );
    }

    await this.securityRepository.updateSecuritySettings(userId, {
      twoFactorEnabled: dto.twoFactorEnabled,
      twoFactorMethod: dto.twoFactorMethod,
      passkeysEnabled: dto.passkeysEnabled,
    });

    const settings = await this.securityRepository.getSecuritySettings(userId);

    if (!settings) {
      throw new NotFoundException('Security settings not found after update');
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
