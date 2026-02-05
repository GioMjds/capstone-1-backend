import { Injectable } from '@nestjs/common';
import {
  UserPreferences as PrismaUserPreferences,
  UserSecuritySettings as PrismaUserSecuritySettings,
  UserComplianceSettings as PrismaUserComplianceSettings,
  UserNotificationSettings as PrismaUserNotificationSettings,
  Prisma,
} from '@prisma/client';
import { UserPreferencesEntity } from '@/domain/entities/identity/preferences';
import {
  UIPreferencesValueObject,
  NotificationSettingsValueObject,
  SecuritySettingsValueObject,
  ComplianceSettingsValueObject,
} from '@/domain/value-objects/identity/preferences';

type PrismaUserPreferencesWithRelations = PrismaUserPreferences & {
  securitySettings?: PrismaUserSecuritySettings | null;
  complianceSettings?: PrismaUserComplianceSettings | null;
  notificationSettings?: PrismaUserNotificationSettings | null;
};

@Injectable()
export class PreferencesMapper {
  toDomain(
    prismaPreferences: PrismaUserPreferencesWithRelations,
  ): UserPreferencesEntity {
    const uiPreferences = UIPreferencesValueObject.fromPersistence(
      prismaPreferences.uiPreferences as Record<string, unknown>,
    );

    const notificationSettings = prismaPreferences.notificationSettings
      ? NotificationSettingsValueObject.fromPersistence({
          emailNotifications:
            prismaPreferences.notificationSettings.emailNotifications,
          pushNotifications:
            prismaPreferences.notificationSettings.pushNotifications,
          smsNotifications:
            prismaPreferences.notificationSettings.smsNotifications,
          ...(prismaPreferences.notificationSettings.preferences as Record<
            string,
            unknown
          >),
        })
      : NotificationSettingsValueObject.create({});

    void notificationSettings;

    return UserPreferencesEntity.reconstitute({
      id: prismaPreferences.id,
      userId: prismaPreferences.userId,
      theme:
        (uiPreferences.getTheme() as 'light' | 'dark' | 'system') ?? 'LIGHT',
      language: uiPreferences.getLanguage(),
      notifications:
        prismaPreferences.notificationSettings?.emailNotifications ?? true,
    });
  }

  toUiPreferencesPersistence(
    uiPreferences: UIPreferencesValueObject,
  ): Prisma.InputJsonValue {
    return uiPreferences.toPersistence() as Prisma.InputJsonValue;
  }

  toNotificationSettingsPersistence(
    settings: NotificationSettingsValueObject,
  ): {
    emailNotifications: boolean;
    pushNotifications: boolean;
    smsNotifications: boolean;
    preferences: Prisma.InputJsonValue;
  } {
    const data = settings.toPersistence();
    return {
      emailNotifications: data.emailNotifications as boolean,
      pushNotifications: data.pushNotifications as boolean,
      smsNotifications: data.smsNotifications as boolean,
      preferences: {
        digestFrequency: data.digestFrequency,
        quietHoursStart: data.quietHoursStart,
        quietHoursEnd: data.quietHoursEnd,
        securityAlerts: data.securityAlerts,
      } as Prisma.InputJsonValue,
    };
  }

  toSecuritySettingsPersistence(settings: SecuritySettingsValueObject): {
    twoFactorEnabled: boolean;
    twoFactorMethod: string | null;
    passkeysEnabled: boolean;
    passwordChangedAt: Date | null;
    activeSessions: Prisma.InputJsonValue;
    trustedDevices: Prisma.InputJsonValue;
  } {
    return {
      twoFactorEnabled: settings.isTwoFactorEnabled(),
      twoFactorMethod: settings.getTwoFactorMethod() ?? null,
      passkeysEnabled: settings.arePasskeysEnabled(),
      passwordChangedAt: settings.getPasswordChangedAt() ?? null,
      activeSessions: settings.getActiveSessions() as Prisma.InputJsonValue,
      trustedDevices: settings.getTrustedDevices() as Prisma.InputJsonValue,
    };
  }

  toComplianceSettingsPersistence(settings: ComplianceSettingsValueObject): {
    dataShareConsent: boolean;
    dataRetentionMonths: number;
    allowAccountDeletion: boolean;
    auditLogPreference: string;
  } {
    return {
      dataShareConsent: settings.isDataShareConsentGiven(),
      dataRetentionMonths: settings.getDataRetentionMonths(),
      allowAccountDeletion: settings.isAccountDeletionAllowed(),
      auditLogPreference: settings.getAuditLogPreference(),
    };
  }
}
