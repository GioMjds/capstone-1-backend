import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '@/infrastructure/persistence';
import { IUserPreferencesRepository } from '@/domain/repositories/identity/preferences';
import { UserPreferencesEntity } from '@/domain/entities/identity/preferences';
import {
  UIPreferencesValueObject,
  NotificationSettingsValueObject,
  SecuritySettingsValueObject,
  ComplianceSettingsValueObject,
} from '@/domain/value-objects/identity/preferences';
import { PreferencesMapper } from '@/infrastructure/persistence/prisma/mappers/identity/preferences';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class PrismaUserPreferencesRepository implements IUserPreferencesRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mapper: PreferencesMapper,
  ) {}

  async findByUserId(userId: string): Promise<UserPreferencesEntity | null> {
    const preferences = await this.prisma.userPreferences.findUnique({
      where: { userId },
      include: {
        securitySettings: true,
        complianceSettings: true,
        notificationSettings: true,
      },
    });

    return preferences ? this.mapper.toDomain(preferences) : null;
  }

  async save(preferences: UserPreferencesEntity): Promise<UserPreferencesEntity> {
    const saved = await this.prisma.userPreferences.create({
      data: {
        id: preferences.id,
        userId: preferences.userId,
        uiPreferences: {
          theme: preferences.getTheme(),
          language: preferences.getLanguage(),
        } as Prisma.InputJsonValue,
      },
      include: {
        securitySettings: true,
        complianceSettings: true,
        notificationSettings: true,
      },
    });

    return this.mapper.toDomain(saved);
  }

  async update(preferences: UserPreferencesEntity): Promise<UserPreferencesEntity> {
    const updated = await this.prisma.userPreferences.update({
      where: { userId: preferences.userId },
      data: {
        uiPreferences: {
          theme: preferences.getTheme(),
          language: preferences.getLanguage(),
        } as Prisma.InputJsonValue,
      },
      include: {
        securitySettings: true,
        complianceSettings: true,
        notificationSettings: true,
      },
    });

    return this.mapper.toDomain(updated);
  }

  async delete(userId: string): Promise<void> {
    await this.prisma.userPreferences.delete({
      where: { userId },
    });
  }

  async updateUiPreferences(
    userId: string,
    uiPreferences: UIPreferencesValueObject,
  ): Promise<void> {
    await this.prisma.userPreferences.update({
      where: { userId },
      data: {
        uiPreferences: this.mapper.toUiPreferencesPersistence(uiPreferences),
      },
    });
  }

  async updateNotificationSettings(
    userId: string,
    notificationSettings: NotificationSettingsValueObject,
  ): Promise<void> {
    const preferences = await this.prisma.userPreferences.findUnique({
      where: { userId },
    });

    if (!preferences) return;

    const data = this.mapper.toNotificationSettingsPersistence(notificationSettings);

    await this.prisma.userNotificationSettings.upsert({
      where: { userPreferencesId: preferences.id },
      update: {
        emailNotifications: data.emailNotifications,
        pushNotifications: data.pushNotifications,
        smsNotifications: data.smsNotifications,
        preferences: data.preferences,
      },
      create: {
        id: uuidv4().slice(0, 12),
        userPreferencesId: preferences.id,
        emailNotifications: data.emailNotifications,
        pushNotifications: data.pushNotifications,
        smsNotifications: data.smsNotifications,
        preferences: data.preferences,
      },
    });
  }

  async updateSecuritySettings(
    userId: string,
    securitySettings: SecuritySettingsValueObject,
  ): Promise<void> {
    const preferences = await this.prisma.userPreferences.findUnique({
      where: { userId },
    });

    if (!preferences) return;

    const data = this.mapper.toSecuritySettingsPersistence(securitySettings);

    await this.prisma.userSecuritySettings.upsert({
      where: { userPreferencesId: preferences.id },
      update: {
        twoFactorEnabled: data.twoFactorEnabled,
        twoFactorMethod: data.twoFactorMethod,
        passkeysEnabled: data.passkeysEnabled,
        passwordChangedAt: data.passwordChangedAt,
        activeSessions: data.activeSessions,
        trustedDevices: data.trustedDevices,
      },
      create: {
        id: uuidv4().slice(0, 12),
        userPreferencesId: preferences.id,
        twoFactorEnabled: data.twoFactorEnabled,
        twoFactorMethod: data.twoFactorMethod,
        passkeysEnabled: data.passkeysEnabled,
        passwordChangedAt: data.passwordChangedAt,
        activeSessions: data.activeSessions,
        trustedDevices: data.trustedDevices,
      },
    });
  }

  async updateComplianceSettings(
    userId: string,
    complianceSettings: ComplianceSettingsValueObject,
  ): Promise<void> {
    const preferences = await this.prisma.userPreferences.findUnique({
      where: { userId },
    });

    if (!preferences) return;

    const data = this.mapper.toComplianceSettingsPersistence(complianceSettings);

    await this.prisma.userComplianceSettings.upsert({
      where: { userPreferencesId: preferences.id },
      update: data,
      create: {
        id: uuidv4().slice(0, 12),
        userPreferencesId: preferences.id,
        ...data,
      },
    });
  }
}
