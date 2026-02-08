import { IPrivacySettings } from '@/domain/interfaces';

export abstract class IPrivacyRepository {
  abstract getPrivacySettings(
    userId: string,
  ): Promise<IPrivacySettings | null>;

  abstract updatePrivacySettings(
    userId: string,
    settings: Partial<IPrivacySettings>,
  ): Promise<void>;

  abstract updateProfileVisibility(
    userId: string,
    visibility: string,
  ): Promise<void>;

  abstract updateOnlinePresence(
    userId: string,
    presence: string,
  ): Promise<void>;

  abstract updateActivityVisibility(
    userId: string,
    activityVisibility: Record<string, unknown>,
  ): Promise<void>;

  abstract updateFieldLevelVisibility(
    userId: string,
    fieldVisibility: Record<string, unknown>,
  ): Promise<void>;
}
