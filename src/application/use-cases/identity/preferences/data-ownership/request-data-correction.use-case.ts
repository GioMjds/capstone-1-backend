import { Injectable } from '@nestjs/common';
import {
  RequestDataCorrectionDto,
  DataCorrectionResponseDto,
} from '@/application/dto/identity/preferences';

@Injectable()
export class RequestDataCorrectionUseCase {
  constructor() {}

  async execute(dto: RequestDataCorrectionDto): Promise<DataCorrectionResponseDto> {
    return {
      requestId: 'correction-123',
      status: 'pending',
      fieldName: dto.fieldName,
      requestedAt: new Date(),
    };
  }
}
