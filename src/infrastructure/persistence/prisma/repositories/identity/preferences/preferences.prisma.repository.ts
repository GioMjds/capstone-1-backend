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
import { generateUserId } from '@/shared/utils';
import {
  IDataOwnershipSettings,
  IPrivacySettings,
  IAccountControlSettings,
  VisibilityLevel,
} from '@/domain/interfaces';

const FULL_PREFERENCES_INCLUDE = {
  accessibilitySettings: true,
  customizationSettings: true,
  securitySettings: true,
  notificationSettings: true,
  privacySettings: true,
  accountControl: true,
  dataOwnership: true,
} as const;

@Injectable()
export class PrismaUserPreferencesRepository implements IUserPreferencesRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mapper: PreferencesMapper,
  ) {}

  async findByUserId(userId: string): Promise<UserPreferencesEntity | null> {
    const preferences = await this.prisma.userPreferences.findUnique({
      where: { userId },
      include: FULL_PREFERENCES_INCLUDE,
    });

    return preferences ? this.mapper.toDomain(preferences) : null;
  }

  async createDefaultPreferences(
    userId: string,
  ): Promise<UserPreferencesEntity> {
    const defaultNotificationPreferences = {
      digestFrequency: 'daily',
      quietHoursStart: null,
      quietHoursEnd: null,
      securityAlerts: true,
    } as Prisma.InputJsonValue;

    const defaultActivityVisibility = {
      showLoginActivity: false,
      showLastSeen: false,
      showProfileViews: false,
      showContentInteractions: false,
    } as Prisma.InputJsonValue;

    const defaultFieldLevelVisibility = {
      email: VisibilityLevel.PRIVATE,
      phone: VisibilityLevel.PRIVATE,
      fullName: VisibilityLevel.FRIENDS_ONLY,
      avatar: VisibilityLevel.PUBLIC,
      bio: VisibilityLevel.PUBLIC,
    } as Prisma.InputJsonValue;

    const created = await this.prisma.userPreferences.create({
      data: {
        id: generateUserId(),
        userId,
        accessibilitySettings: {
          create: {
            id: generateUserId(),
            language: 'en',
            timezone: 'UTC',
            dateFormat: 'MM/DD/YYYY',
            numberFormat: '1,000.00',
            currency: 'USD',
            timeFormat: '12h',
            highContrastMode: false,
            reducedMotion: false,
            screenReaderOptimized: false,
            fontSize: 'medium',
            keyboardNavigation: false,
            colorBlindMode: null,
          },
        },
        customizationSettings: {
          create: {
            id: generateUserId(),
            theme: 'system',
            layoutPreferences: {} as Prisma.InputJsonValue,
            defaultViews: {} as Prisma.InputJsonValue,
            sortFilterDefaults: {} as Prisma.InputJsonValue,
            paginationSize: 10,
            featureToggles: {} as Prisma.InputJsonValue,
            betaFeaturesOptIn: false,
            aiFeaturesOptIn: false,
            contentSensitivityFilters: {} as Prisma.InputJsonValue,
            sidebarCollapsed: false,
            compactMode: false,
          },
        },
        notificationSettings: {
          create: {
            id: generateUserId(),
            emailNotifications: true,
            pushNotifications: true,
            smsNotifications: false,
            preferences: defaultNotificationPreferences,
            emailByCategory: {} as Prisma.InputJsonValue,
            pushByCategory: {} as Prisma.InputJsonValue,
            smsAlerts: {} as Prisma.InputJsonValue,
            quietHoursStart: null,
            quietHoursEnd: null,
            marketingOptIn: false,
            digestFrequency: 'daily',
          },
        },
        securitySettings: {
          create: {
            id: generateUserId(),
            twoFactorEnabled: false,
            twoFactorMethod: null,
            passkeysEnabled: false,
            passwordChangedAt: new Date(),
            activeSessions: [] as Prisma.InputJsonValue,
            trustedDevices: [] as Prisma.InputJsonValue,
            ipRestrictions: [] as Prisma.InputJsonValue,
            loginAlerts: {} as Prisma.InputJsonValue,
            suspiciousActivityAlerts: {} as Prisma.InputJsonValue,
            backupCodes: [] as Prisma.InputJsonValue,
            sessionExpiration: 3600,
            passwordRotationReminder: 90,
          },
        },
        accountControl: {
          create: {
            id: generateUserId(),
            deactivated: false,
            deactivatedAt: null,
            deletionRequested: false,
            deletionRequestedAt: null,
            recoveryToken: null,
          },
        },
        dataOwnership: {
          create: {
            id: generateUserId(),
            exportFormat: 'json',
            dataRetentionDays: 365,
            allowAutoDelete: false,
            allowDataAnonymization: false,
            dataExportRequests: [] as Prisma.InputJsonValue,
            dataDeletionRequests: [] as Prisma.InputJsonValue,
            dataCorrections: [] as Prisma.InputJsonValue,
          },
        },
        privacySettings: {
          create: {
            id: generateUserId(),
            profileVisibility: 'private',
            activityVisibility: defaultActivityVisibility,
            fieldLevelVisibility: defaultFieldLevelVisibility,
            onlinePresence: 'hidden',
            allowPublicProfile: false,
            allowSearchEngineIndex: false,
            allowThirdPartySharing: false,
            dataShareConsent: false,
            dataRetentionMonths: 12,
            auditLogPreference: 'full',
          },
        },
      },
      include: FULL_PREFERENCES_INCLUDE,
    });

    return this.mapper.toDomain(created);
  }

  async save(
    preferences: UserPreferencesEntity,
  ): Promise<UserPreferencesEntity> {
    const saved = await this.prisma.userPreferences.create({
      data: {
        id: preferences.id,
        userId: preferences.userId,
        accessibilitySettings: {
          create: {
            id: generateUserId(),
            language: preferences.getLanguage(),
          },
        },
        customizationSettings: {
          create: {
            id: generateUserId(),
            theme: preferences.getTheme(),
          },
        },
      },
      include: FULL_PREFERENCES_INCLUDE,
    });

    return this.mapper.toDomain(saved);
  }

  async update(
    preferences: UserPreferencesEntity,
  ): Promise<UserPreferencesEntity> {
    const existing = await this.prisma.userPreferences.findUnique({
      where: { userId: preferences.userId },
      select: { id: true },
    });

    if (!existing) {
      return this.save(preferences);
    }

    await this.prisma.accessibilitySettings.upsert({
      where: { userPreferencesId: existing.id },
      update: { language: preferences.getLanguage() },
      create: {
        id: generateUserId(),
        userPreferencesId: existing.id,
        language: preferences.getLanguage(),
      },
    });

    await this.prisma.customizationSettings.upsert({
      where: { userPreferencesId: existing.id },
      update: { theme: preferences.getTheme() },
      create: {
        id: generateUserId(),
        userPreferencesId: existing.id,
        theme: preferences.getTheme(),
      },
    });

    const updated = await this.prisma.userPreferences.findUnique({
      where: { userId: preferences.userId },
      include: FULL_PREFERENCES_INCLUDE,
    });

    return this.mapper.toDomain(updated!);
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
    const preferences = await this.prisma.userPreferences.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!preferences) return;

    const { accessibilityData, customizationData } =
      this.mapper.toUiPreferencesPersistence(uiPreferences);

    await this.prisma.accessibilitySettings.upsert({
      where: { userPreferencesId: preferences.id },
      update: accessibilityData,
      create: {
        id: generateUserId(),
        userPreferencesId: preferences.id,
        ...accessibilityData,
      },
    });

    await this.prisma.customizationSettings.upsert({
      where: { userPreferencesId: preferences.id },
      update: customizationData,
      create: {
        id: generateUserId(),
        userPreferencesId: preferences.id,
        ...customizationData,
      },
    });
  }

  async updateNotificationSettings(
    userId: string,
    notificationSettings: NotificationSettingsValueObject,
  ): Promise<void> {
    const preferences = await this.prisma.userPreferences.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!preferences) return;

    const data =
      this.mapper.toNotificationSettingsPersistence(notificationSettings);

    await this.prisma.userNotificationSettings.upsert({
      where: { userPreferencesId: preferences.id },
      update: {
        emailNotifications: data.emailNotifications,
        pushNotifications: data.pushNotifications,
        smsNotifications: data.smsNotifications,
        preferences: data.preferences,
      },
      create: {
        id: generateUserId(),
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
      select: { id: true },
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
        id: generateUserId(),
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
      select: { id: true },
    });

    if (!preferences) return;

    const data =
      this.mapper.toComplianceSettingsPersistence(complianceSettings);

    await this.prisma.privacySettings.upsert({
      where: { userPreferencesId: preferences.id },
      update: {
        dataShareConsent: data.dataShareConsent,
        dataRetentionMonths: data.dataRetentionMonths,
        auditLogPreference: data.auditLogPreference,
      },
      create: {
        id: generateUserId(),
        userPreferencesId: preferences.id,
        dataShareConsent: data.dataShareConsent,
        dataRetentionMonths: data.dataRetentionMonths,
        auditLogPreference: data.auditLogPreference,
      },
    });
  }

  async updateDataOwnershipSettings(
    userId: string,
    settings: Partial<IDataOwnershipSettings>,
  ): Promise<void> {
    const preferences = await this.prisma.userPreferences.findUnique({
      where: { userId },
    });

    if (!preferences) return;

    await this.prisma.dataOwnershipSettings.upsert({
      where: { userPreferencesId: preferences.id },
      update: {
        exportFormat: settings.exportFormat,
        dataRetentionDays: settings.dataRetentionDays,
        allowAutoDelete: settings.allowAutoDelete,
        allowDataAnonymization: settings.allowDataAnonymization,
        dataExportRequests:
          settings.dataExportRequests as unknown as Prisma.InputJsonValue,
        dataDeletionRequests:
          settings.dataDeletionRequests as unknown as Prisma.InputJsonValue,
        dataCorrections:
          settings.dataCorrections as unknown as Prisma.InputJsonValue,
      },
      create: {
        id: generateUserId(),
        userPreferencesId: preferences.id,
        exportFormat: settings.exportFormat ?? 'json',
        dataRetentionDays: settings.dataRetentionDays ?? 365,
        allowAutoDelete: settings.allowAutoDelete ?? false,
        allowDataAnonymization: settings.allowDataAnonymization ?? false,
        dataExportRequests: (settings.dataExportRequests ??
          []) as unknown as Prisma.InputJsonValue,
        dataDeletionRequests: (settings.dataDeletionRequests ??
          []) as unknown as Prisma.InputJsonValue,
        dataCorrections: (settings.dataCorrections ??
          []) as unknown as Prisma.InputJsonValue,
      },
    });
  }

  async updatePrivacySettings(
    userId: string,
    settings: Partial<IPrivacySettings>,
  ): Promise<void> {
    const preferences = await this.prisma.userPreferences.findUnique({
      where: { userId },
    });

    if (!preferences) return;

    await this.prisma.privacySettings.upsert({
      where: { userPreferencesId: preferences.id },
      update: {
        profileVisibility: settings.profileVisibility,
        activityVisibility:
          settings.activityVisibility as unknown as Prisma.InputJsonValue,
        fieldLevelVisibility:
          settings.fieldLevelVisibility as unknown as Prisma.InputJsonValue,
        onlinePresence: settings.onlinePresence,
        allowPublicProfile: settings.allowPublicProfile,
        allowSearchEngineIndex: settings.allowSearchEngineIndex,
        allowThirdPartySharing: settings.allowThirdPartySharing,
      },
      create: {
        id: generateUserId(),
        userPreferencesId: preferences.id,
        profileVisibility: settings.profileVisibility ?? 'private',
        activityVisibility: (settings.activityVisibility ??
          {}) as unknown as Prisma.InputJsonValue,
        fieldLevelVisibility: (settings.fieldLevelVisibility ??
          {}) as unknown as Prisma.InputJsonValue,
        onlinePresence: settings.onlinePresence ?? 'hidden',
        allowPublicProfile: settings.allowPublicProfile ?? false,
        allowSearchEngineIndex: settings.allowSearchEngineIndex ?? false,
        allowThirdPartySharing: settings.allowThirdPartySharing ?? false,
      },
    });
  }

  async updateAccountControlSettings(
    userId: string,
    settings: Partial<IAccountControlSettings>,
  ): Promise<void> {
    const preferences = await this.prisma.userPreferences.findUnique({
      where: { userId },
    });

    if (!preferences) return;

    await this.prisma.accountControlSettings.upsert({
      where: { userPreferencesId: preferences.id },
      update: {
        deactivated: settings.deactivated,
        deactivatedAt: settings.deactivatedAt,
        deletionRequested: settings.deletionRequested,
        deletionRequestedAt: settings.deletionRequestedAt,
        recoveryToken: settings.recoveryToken,
      },
      create: {
        id: generateUserId(),
        userPreferencesId: preferences.id,
        deactivated: settings.deactivated ?? false,
        deactivatedAt: settings.deactivatedAt ?? null,
        deletionRequested: settings.deletionRequested ?? false,
        deletionRequestedAt: settings.deletionRequestedAt ?? null,
        recoveryToken: settings.recoveryToken ?? null,
      },
    });
  }

  async getDataOwnershipSettings(
    userId: string,
  ): Promise<IDataOwnershipSettings | null> {
    const preferences = await this.prisma.userPreferences.findUnique({
      where: { userId },
      include: { dataOwnership: true },
    });

    if (!preferences?.dataOwnership) return null;

    const data = preferences.dataOwnership;
    return {
      id: data.id,
      userPreferencesId: data.userPreferencesId,
      exportFormat: data.exportFormat,
      dataRetentionDays: data.dataRetentionDays,
      allowAutoDelete: data.allowAutoDelete,
      allowDataAnonymization: data.allowDataAnonymization,
      dataExportRequests:
        data.dataExportRequests as unknown as IDataOwnershipSettings['dataExportRequests'],
      dataDeletionRequests:
        data.dataDeletionRequests as unknown as IDataOwnershipSettings['dataDeletionRequests'],
      dataCorrections:
        data.dataCorrections as unknown as IDataOwnershipSettings['dataCorrections'],
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }

  async getPrivacySettings(userId: string): Promise<IPrivacySettings | null> {
    const preferences = await this.prisma.userPreferences.findUnique({
      where: { userId },
      include: { privacySettings: true },
    });

    if (!preferences?.privacySettings) return null;

    const data = preferences.privacySettings;
    return {
      id: data.id,
      userPreferencesId: data.userPreferencesId,
      profileVisibility: data.profileVisibility,
      activityVisibility:
        data.activityVisibility as unknown as IPrivacySettings['activityVisibility'],
      fieldLevelVisibility:
        data.fieldLevelVisibility as unknown as IPrivacySettings['fieldLevelVisibility'],
      onlinePresence: data.onlinePresence,
      allowPublicProfile: data.allowPublicProfile,
      allowSearchEngineIndex: data.allowSearchEngineIndex,
      allowThirdPartySharing: data.allowThirdPartySharing,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }

  async getAccountControlSettings(
    userId: string,
  ): Promise<IAccountControlSettings | null> {
    const preferences = await this.prisma.userPreferences.findUnique({
      where: { userId },
      include: { accountControl: true },
    });

    if (!preferences?.accountControl) return null;

    const data = preferences.accountControl;
    return {
      id: data.id,
      userPreferencesId: data.userPreferencesId,
      deactivated: data.deactivated,
      deactivatedAt: data.deactivatedAt,
      deletionRequested: data.deletionRequested,
      deletionRequestedAt: data.deletionRequestedAt,
      recoveryToken: data.recoveryToken,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }
}
