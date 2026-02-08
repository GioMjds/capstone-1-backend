import { Injectable } from '@nestjs/common';
import { AccountControlSettings as PrismaAccountControlSettings } from '@prisma/client';
import { IAccountControlSettings } from '@/domain/interfaces';

@Injectable()
export class AccountControlsMapper {
  toDomain(model: PrismaAccountControlSettings): IAccountControlSettings {
    return {
      id: model.id,
      userPreferencesId: model.userPreferencesId,
      deactivated: model.deactivated,
      deactivatedAt: model.deactivatedAt,
      deletionRequested: model.deletionRequested,
      deletionRequestedAt: model.deletionRequestedAt,
      recoveryToken: model.recoveryToken,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    };
  }
}
