import { UserPreferencesEntity } from '@/domain/entities/identity/preferences';
import { UIPreferencesValueObject } from '@/domain/value-objects/identity/preferences';
import { NotificationSettingsValueObject } from '@/domain/value-objects/identity/preferences';
import { SecuritySettingsValueObject } from '@/domain/value-objects/identity/preferences';
import { ComplianceSettingsValueObject } from '@/domain/value-objects/identity/preferences';

export abstract class IUserPreferencesRepository {
  abstract findByUserId(userId: string): Promise<UserPreferencesEntity | null>;
  abstract save(preferences: UserPreferencesEntity): Promise<UserPreferencesEntity>;
  abstract update(preferences: UserPreferencesEntity): Promise<UserPreferencesEntity>;
  abstract delete(userId: string): Promise<void>;

  abstract updateUiPreferences(
    userId: string,
    uiPreferences: UIPreferencesValueObject,
  ): Promise<void>;

  abstract updateNotificationSettings(
    userId: string,
    notificationSettings: NotificationSettingsValueObject,
  ): Promise<void>;

  abstract updateSecuritySettings(
    userId: string,
    securitySettings: SecuritySettingsValueObject,
  ): Promise<void>;

  abstract updateComplianceSettings(
    userId: string,
    complianceSettings: ComplianceSettingsValueObject,
  ): Promise<void>;
}
