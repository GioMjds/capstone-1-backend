import { Injectable } from '@nestjs/common';
import {
  ExportPersonalDataDto,
  DataExportResponseDto,
} from '@/application/dto/identity/preferences';
import { ExportFormat } from '@/domain/interfaces';

@Injectable()
export class ExportPersonalDataUseCase {
  constructor() {}

  async execute(dto: ExportPersonalDataDto): Promise<DataExportResponseDto> {
    return {
      exportId: 'export-personal-123',
      status: 'pending',
      format: dto.format ?? ExportFormat.JSON,
      requestedAt: new Date(),
      estimatedCompletionAt: new Date(Date.now() + 3600000),
    };
  }
}
