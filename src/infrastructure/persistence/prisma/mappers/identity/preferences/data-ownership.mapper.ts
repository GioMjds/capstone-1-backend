import { Injectable } from '@nestjs/common';
import { DataOwnershipSettings as PrismaDataOwnershipSettings } from '@prisma/client';
import { IDataOwnershipSettings } from '@/domain/interfaces';

@Injectable()
export class DataOwnershipMapper {
  toDomain(model: PrismaDataOwnershipSettings): IDataOwnershipSettings {
    return {
      id: model.id,
      userPreferencesId: model.userPreferencesId,
      exportFormat: model.exportFormat,
      dataRetentionDays: model.dataRetentionDays,
      allowAutoDelete: model.allowAutoDelete,
      allowDataAnonymization: model.allowDataAnonymization,
      dataExportRequests: model.dataExportRequests as unknown as IDataOwnershipSettings['dataExportRequests'],
      dataDeletionRequests: model.dataDeletionRequests as unknown as IDataOwnershipSettings['dataDeletionRequests'],
      dataCorrections: model.dataCorrections as unknown as IDataOwnershipSettings['dataCorrections'],
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    };
  }
}
