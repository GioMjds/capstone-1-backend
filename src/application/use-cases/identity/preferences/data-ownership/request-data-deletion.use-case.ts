import { Injectable } from '@nestjs/common';
import {
  RequestDataDeletionDto,
  DataDeletionResponseDto,
} from '@/application/dto/identity/preferences';

@Injectable()
export class RequestDataDeletionUseCase {
  constructor() {}

  async execute(dto: RequestDataDeletionDto): Promise<DataDeletionResponseDto> {
    return {
      requestId: 'deletion-123',
      status: 'pending',
      dataCategories: dto.dataCategories,
      requestedAt: new Date(),
      scheduledDeletionAt: new Date(Date.now() + 30 * 24 * 3600000),
    };
  }
}
