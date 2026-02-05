import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infrastructure/persistence';
import { SecuritySettingsValueObject } from '@/domain/value-objects/identity';
import { InvalidStateException } from '@/shared/exceptions';
import { randomUUID } from 'crypto';
import { UpdateSecuritySettingsDto } from '@/application/dto/identity/preferences/security/update-security-settings.dto';

@Injectable()
export class UpdateSecuritySettingsUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(
    userId: string,
    dto: UpdateSecuritySettingsDto,
  ): Promise<SecuritySettingsValueObject> {
    if (dto.twoFactorEnabled && !dto.twoFactorMethod) {
      throw new InvalidStateException(
        '2FA method must be specified when enabling 2FA',
      );
    }

    let userPreferences = await this.prisma.userPreferences.findUnique({
      where: { userId },
      include: { securitySettings: true },
    });

    if (!userPreferences) {
      const preferencesId = randomUUID().replace(/-/g, '').substring(0, 12);
      userPreferences = await this.prisma.userPreferences.create({
        data: {
          id: preferencesId,
          userId,
          securitySettings: {
            create: {
              id: randomUUID().replace(/-/g, '').substring(0, 12),
              twoFactorEnabled: dto.twoFactorEnabled ?? false,
              twoFactorMethod: dto.twoFactorMethod,
              passkeysEnabled: dto.passkeysEnabled ?? false,
            },
          },
        },
        include: { securitySettings: true },
      });
    } else if (!userPreferences.securitySettings) {
      await this.prisma.userSecuritySettings.create({
        data: {
          id: randomUUID().replace(/-/g, '').substring(0, 12),
          userPreferencesId: userPreferences.id,
          twoFactorEnabled: dto.twoFactorEnabled ?? false,
          twoFactorMethod: dto.twoFactorMethod,
          passkeysEnabled: dto.passkeysEnabled ?? false,
        },
      });

      userPreferences = await this.prisma.userPreferences.findUnique({
        where: { userId },
        include: { securitySettings: true },
      });
    } else {
      await this.prisma.userSecuritySettings.update({
        where: { id: userPreferences.securitySettings.id },
        data: {
          ...(dto.twoFactorEnabled !== undefined && {
            twoFactorEnabled: dto.twoFactorEnabled,
          }),
          ...(dto.twoFactorMethod && { twoFactorMethod: dto.twoFactorMethod }),
          ...(dto.passkeysEnabled !== undefined && {
            passkeysEnabled: dto.passkeysEnabled,
          }),
          updatedAt: new Date(),
        },
      });

      userPreferences = await this.prisma.userPreferences.findUnique({
        where: { userId },
        include: { securitySettings: true },
      });
    }

    const securitySettings = {
      twoFactorEnabled: userPreferences?.securitySettings?.twoFactorEnabled,
      twoFactorMethod: userPreferences?.securitySettings?.twoFactorMethod,
      passkeysEnabled: userPreferences?.securitySettings?.passkeysEnabled,
    };

    return SecuritySettingsValueObject.fromPersistence(securitySettings);
  }

  validateDeviceTrust(deviceFingerprint: string): string | boolean {
    return deviceFingerprint && deviceFingerprint.length > 0;
  }

  isSessionActive(sessionId: string, activeSessions: Record<string, any>[]): boolean {
    return activeSessions.some(session => session.id === sessionId);
  }

  shouldTerminateSession(lastActivityTime: Date, maxInactivityMinutes: number = 30): boolean {
    const now = new Date();
    const diffMinutes = (now.getTime() - lastActivityTime.getTime()) / (1000 * 60);
    return diffMinutes > maxInactivityMinutes;
  }
}
