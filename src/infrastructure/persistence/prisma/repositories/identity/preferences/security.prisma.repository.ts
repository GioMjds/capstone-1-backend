import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '@/infrastructure/persistence';
import { ISecurityRepository } from '@/domain/repositories/identity/preferences';
import { SecurityMapper, SecuritySettingsDomain } from '@/infrastructure/persistence/prisma/mappers/identity/preferences';
import { generateUserId } from '@/shared/utils';
import { randomBytes } from 'crypto';

@Injectable()
export class PrismaSecurityRepository implements ISecurityRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mapper: SecurityMapper,
  ) {}

  private async getUserPreferencesId(userId: string): Promise<string | null> {
    const preferences = await this.prisma.userPreferences.findUnique({
      where: { userId },
      select: { id: true },
    });
    return preferences?.id ?? null;
  }

  async getSecuritySettings(
    userId: string,
  ): Promise<SecuritySettingsDomain | null> {
    const preferencesId = await this.getUserPreferencesId(userId);
    if (!preferencesId) return null;

    const settings = await this.prisma.userSecuritySettings.findUnique({
      where: { userPreferencesId: preferencesId },
    });

    return settings ? this.mapper.toDomain(settings) : null;
  }

  async updateSecuritySettings(
    userId: string,
    settings: Partial<{
      twoFactorEnabled: boolean;
      twoFactorMethod: string | null;
      passkeysEnabled: boolean;
      ipRestrictions: unknown[];
      loginAlerts: Record<string, unknown>;
      suspiciousActivityAlerts: Record<string, unknown>;
      backupCodes: unknown[];
      sessionExpiration: number;
      passwordRotationReminder: number;
    }>,
  ): Promise<void> {
    const preferencesId = await this.getUserPreferencesId(userId);
    if (!preferencesId) return;

    const updateData: Record<string, unknown> = {};
    if (settings.twoFactorEnabled !== undefined) updateData.twoFactorEnabled = settings.twoFactorEnabled;
    if (settings.twoFactorMethod !== undefined) updateData.twoFactorMethod = settings.twoFactorMethod;
    if (settings.passkeysEnabled !== undefined) updateData.passkeysEnabled = settings.passkeysEnabled;
    if (settings.ipRestrictions !== undefined) updateData.ipRestrictions = settings.ipRestrictions as Prisma.InputJsonValue;
    if (settings.loginAlerts !== undefined) updateData.loginAlerts = settings.loginAlerts as Prisma.InputJsonValue;
    if (settings.suspiciousActivityAlerts !== undefined) updateData.suspiciousActivityAlerts = settings.suspiciousActivityAlerts as Prisma.InputJsonValue;
    if (settings.backupCodes !== undefined) updateData.backupCodes = settings.backupCodes as Prisma.InputJsonValue;
    if (settings.sessionExpiration !== undefined) updateData.sessionExpiration = settings.sessionExpiration;
    if (settings.passwordRotationReminder !== undefined) updateData.passwordRotationReminder = settings.passwordRotationReminder;

    await this.prisma.userSecuritySettings.upsert({
      where: { userPreferencesId: preferencesId },
      update: updateData,
      create: {
        id: generateUserId(),
        userPreferencesId: preferencesId,
        ...updateData,
      },
    });
  }

  async enableMfa(userId: string, method: string): Promise<void> {
    await this.updateSecuritySettings(userId, {
      twoFactorEnabled: true,
      twoFactorMethod: method,
    });
  }

  async disableMfa(userId: string): Promise<void> {
    await this.updateSecuritySettings(userId, {
      twoFactorEnabled: false,
      twoFactorMethod: null,
    });
  }

  async regenerateBackupCodes(userId: string): Promise<string[]> {
    const codes = Array.from({ length: 10 }, () =>
      randomBytes(4).toString('hex').toUpperCase(),
    );

    await this.updateSecuritySettings(userId, {
      backupCodes: codes,
    });

    return codes;
  }
}
