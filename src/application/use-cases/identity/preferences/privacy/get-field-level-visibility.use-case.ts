import { Inject, Injectable } from '@nestjs/common';
import {
  FieldLevelVisibilityResponseDto,
  FieldVisibility,
} from '@/application/dto/identity/preferences';
import { IPrivacyRepository } from '@/domain/repositories/identity/preferences';

@Injectable()
export class GetFieldLevelVisibilityUseCase {
  constructor(
    @Inject('IPrivacyRepository')
    private readonly privacyRepository: IPrivacyRepository,
  ) {}

  async execute(userId: string): Promise<FieldLevelVisibilityResponseDto> {
    const settings = await this.privacyRepository.getPrivacySettings(userId);

    if (!settings) {
      return {
        fields: [
          { fieldName: 'email', visibility: FieldVisibility.PRIVATE },
          { fieldName: 'phone', visibility: FieldVisibility.CONTACTS },
          { fieldName: 'birthday', visibility: FieldVisibility.PUBLIC },
        ],
        updatedAt: new Date(),
      };
    }

    const fieldVis = (settings.fieldLevelVisibility ?? {}) as Record<string, string>;
    const fields = Object.entries(fieldVis).map(([fieldName, visibility]) => ({
      fieldName,
      visibility: visibility as FieldVisibility,
    }));

    return {
      fields: fields.length > 0 ? fields : [
        { fieldName: 'email', visibility: FieldVisibility.PRIVATE },
        { fieldName: 'phone', visibility: FieldVisibility.CONTACTS },
        { fieldName: 'birthday', visibility: FieldVisibility.PUBLIC },
      ],
      updatedAt: settings.updatedAt,
    };
  }
}
