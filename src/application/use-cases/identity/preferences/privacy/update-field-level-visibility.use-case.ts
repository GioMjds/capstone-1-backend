import { Injectable } from '@nestjs/common';
import {
  UpdateFieldLevelVisibilityDto,
  FieldLevelVisibilityResponseDto,
} from '@/application/dto/identity/preferences';

@Injectable()
export class UpdateFieldLevelVisibilityUseCase {
  constructor() {}

  async execute(dto: UpdateFieldLevelVisibilityDto): Promise<FieldLevelVisibilityResponseDto> {
    return {
      fields: dto.fields,
      updatedAt: new Date(),
    };
  }
}
