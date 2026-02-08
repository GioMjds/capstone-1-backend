import { Injectable } from '@nestjs/common';
import {
  UserPreferences as PrismaUserPreferences,
  UserSecuritySettings as PrismaUserSecuritySettings,
  UserNotificationSettings as PrismaUserNotificationSettings,
  AccessibilitySettings as PrismaAccessibilitySettings,
  CustomizationSettings as PrismaCustomizationSettings,
  PrivacySettings as PrismaPrivacySettings,
  AccountControlSettings as PrismaAccountControlSettings,
  DataOwnershipSettings as PrismaDataOwnershipSettings,
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
  accessibilitySettings?: PrismaAccessibilitySettings | null;
  customizationSettings?: PrismaCustomizationSettings | null;
  securitySettings?: PrismaUserSecuritySettings | null;
  notificationSettings?: PrismaUserNotificationSettings | null;
  privacySettings?: PrismaPrivacySettings | null;
  accountControl?: PrismaAccountControlSettings | null;
  dataOwnership?: PrismaDataOwnershipSettings | null;
};

@Injectable()
export class PreferencesMapper {
  toDomain(
    prismaPreferences: PrismaUserPreferencesWithRelations,
  ): UserPreferencesEntity {
    const theme =
      prismaPreferences.customizationSettings?.theme ?? 'system';
    const language =
      prismaPreferences.accessibilitySettings?.language ?? 'en';
    const notifications =
      prismaPreferences.notificationSettings?.emailNotifications ?? true;

    return UserPreferencesEntity.reconstitute({
      id: prismaPreferences.id,
      userId: prismaPreferences.userId,
      theme,
      language,
      notifications,
    });
  }

  toUiPreferencesPersistence(
    uiPreferences: UIPreferencesValueObject,
  ): {
    accessibilityData: Record<string, unknown>;
    customizationData: Record<string, unknown>;
  } {
    const data = uiPreferences.toPersistence();
    return {
      accessibilityData: {
        language: data.language,
        timezone: data.timezone,
      },
      customizationData: {
        theme: data.theme,
      },
    };
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
    auditLogPreference: string;
  } {
    return {
      dataShareConsent: settings.isDataShareConsentGiven(),
      dataRetentionMonths: settings.getDataRetentionMonths(),
      auditLogPreference: settings.getAuditLogPreference(),
    };
  }
}
