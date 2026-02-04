import { Injectable } from '@nestjs/common';
import {
  AnonymizeDataDto,
  AnonymizationResponseDto,
} from '@/application/dto/identity/preferences';

@Injectable()
export class AnonymizeDataUseCase {
  constructor() {}

  async execute(dto: AnonymizeDataDto): Promise<AnonymizationResponseDto> {
    return {
      requestId: 'anonymize-123',
      status: 'pending',
      dataCategories: dto.dataCategories,
      requestedAt: new Date(),
    };
  }
}
