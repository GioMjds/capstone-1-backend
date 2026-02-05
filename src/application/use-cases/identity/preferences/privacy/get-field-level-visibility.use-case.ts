import { Injectable } from '@nestjs/common';
import {
  FieldLevelVisibilityResponseDto,
  FieldVisibility,
} from '@/application/dto/identity/preferences';

@Injectable()
export class GetFieldLevelVisibilityUseCase {
  constructor() {}

  async execute(userId: string): Promise<FieldLevelVisibilityResponseDto> {
    return {
      fields: [
        { fieldName: 'email', visibility: FieldVisibility.PRIVATE },
        { fieldName: 'phone', visibility: FieldVisibility.CONTACTS },
        { fieldName: 'birthday', visibility: FieldVisibility.PUBLIC },
      ],
      updatedAt: new Date(),
    };
  }
}
