import { IDataOwnershipSettings } from '@/domain/interfaces';

export abstract class IDataOwnershipRepository {
  abstract getDataOwnershipSettings(
    userId: string,
  ): Promise<IDataOwnershipSettings | null>;

  abstract updateDataOwnershipSettings(
    userId: string,
    settings: Partial<IDataOwnershipSettings>,
  ): Promise<void>;

  abstract updateExportFormat(
    userId: string,
    format: string,
  ): Promise<void>;
}
