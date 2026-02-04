import { Injectable } from '@nestjs/common';
import {
  ExportAuditLogsDto,
  ExportAuditLogsResponseDto,
  AuditLogFormat,
} from '@/application/dto/identity/preferences';

@Injectable()
export class ExportAuditLogsUseCase {
  constructor() {}

  async execute(dto: ExportAuditLogsDto): Promise<ExportAuditLogsResponseDto> {
    return {
      id: 'stub-id',
      format: dto.format ?? AuditLogFormat.JSON,
      downloadUrl: 'https://example.com/download',
      expiresAt: new Date(Date.now() + 3600000),
      totalRecords: 0,
      createdAt: new Date(),
    };
  }
}
