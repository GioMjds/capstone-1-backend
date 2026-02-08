import { IAccountControlSettings } from '@/domain/interfaces';

export abstract class IAccountControlsRepository {
  abstract getAccountControlSettings(
    userId: string,
  ): Promise<IAccountControlSettings | null>;

  abstract updateAccountControlSettings(
    userId: string,
    settings: Partial<IAccountControlSettings>,
  ): Promise<void>;

  abstract deactivateAccount(userId: string): Promise<void>;

  abstract reactivateAccount(userId: string): Promise<void>;

  abstract requestDeletion(userId: string): Promise<void>;

  abstract cancelDeletion(userId: string): Promise<void>;
}
