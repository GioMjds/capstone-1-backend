import { Injectable } from '@nestjs/common';
import { PrivacySettings as PrismaPrivacySettings } from '@prisma/client';
import { IPrivacySettings } from '@/domain/interfaces';

@Injectable()
export class PrivacyMapper {
  toDomain(model: PrismaPrivacySettings): IPrivacySettings {
    return {
      id: model.id,
      userPreferencesId: model.userPreferencesId,
      profileVisibility: model.profileVisibility,
      activityVisibility: model.activityVisibility as unknown as IPrivacySettings['activityVisibility'],
      fieldLevelVisibility: model.fieldLevelVisibility as unknown as IPrivacySettings['fieldLevelVisibility'],
      onlinePresence: model.onlinePresence,
      allowPublicProfile: model.allowPublicProfile,
      allowSearchEngineIndex: model.allowSearchEngineIndex,
      allowThirdPartySharing: model.allowThirdPartySharing,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    };
  }
}
