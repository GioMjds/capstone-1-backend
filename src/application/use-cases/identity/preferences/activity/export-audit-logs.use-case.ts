import { Injectable } from '@nestjs/common';
import {
  ExportAuditLogsDto,
  ExportAuditLogsResponseDto,
} from '@/application/dto/identity/preferences';
import { AuditLogFormat } from '@/domain/interfaces';

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
