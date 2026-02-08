import { Inject, Injectable } from '@nestjs/common';
import {
  UpdateFieldLevelVisibilityDto,
  FieldLevelVisibilityResponseDto,
} from '@/application/dto/identity/preferences';
import { IPrivacyRepository } from '@/domain/repositories/identity/preferences';

@Injectable()
export class UpdateFieldLevelVisibilityUseCase {
  constructor(
    @Inject('IPrivacyRepository')
    private readonly privacyRepository: IPrivacyRepository,
  ) {}

  async execute(userId: string, dto: UpdateFieldLevelVisibilityDto): Promise<FieldLevelVisibilityResponseDto> {
    const fieldMap: Record<string, unknown> = {};
    for (const field of dto.fields) {
      fieldMap[field.fieldName] = field.visibility;
    }

    await this.privacyRepository.updateFieldLevelVisibility(userId, fieldMap);

    return {
      fields: dto.fields,
      updatedAt: new Date(),
    };
  }
}
