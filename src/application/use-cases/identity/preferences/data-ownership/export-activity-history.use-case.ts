import { Injectable } from '@nestjs/common';
import {
  ExportActivityHistoryDto,
  DataExportResponseDto,
} from '@/application/dto/identity/preferences';

@Injectable()
export class ExportActivityHistoryUseCase {
  constructor() {}

  async execute(dto: ExportActivityHistoryDto): Promise<DataExportResponseDto> {
    return {
      exportId: 'export-activity-123',
      status: 'pending',
      format: dto.format,
      requestedAt: new Date(),
      estimatedCompletionAt: new Date(Date.now() + 3600000),
    };
  }
}
