import { Injectable } from '@nestjs/common';
import { FieldLevelVisibilityResponseDto } from '@/application/dto/identity/preferences';

@Injectable()
export class GetFieldLevelVisibilityUseCase {
  constructor() {}

  async execute(userId: string): Promise<FieldLevelVisibilityResponseDto> {
    return {
      fields: [
        { fieldName: 'email', visibility: 'private' },
        { fieldName: 'phone', visibility: 'contacts' },
        { fieldName: 'birthday', visibility: 'public' },
      ],
      updatedAt: new Date(),
    };
  }
}
