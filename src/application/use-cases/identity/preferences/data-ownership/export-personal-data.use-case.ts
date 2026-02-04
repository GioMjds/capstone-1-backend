import { Injectable } from '@nestjs/common';
import {
  ExportPersonalDataDto,
  DataExportResponseDto,
} from '@/application/dto/identity/preferences';

@Injectable()
export class ExportPersonalDataUseCase {
  constructor() {}

  async execute(dto: ExportPersonalDataDto): Promise<DataExportResponseDto> {
    return {
      exportId: 'export-personal-123',
      status: 'pending',
      format: dto.format,
      requestedAt: new Date(),
      estimatedCompletionAt: new Date(Date.now() + 3600000),
    };
  }
}
