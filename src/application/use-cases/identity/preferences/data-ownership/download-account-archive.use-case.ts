import { Injectable } from '@nestjs/common';
import {
  DownloadAccountArchiveDto,
  AccountArchiveResponseDto,
  ArchiveFormat,
} from '@/application/dto/identity/preferences';

@Injectable()
export class DownloadAccountArchiveUseCase {
  constructor() {}

  async execute(dto: DownloadAccountArchiveDto): Promise<AccountArchiveResponseDto> {
    return {
      archiveId: 'archive-123',
      status: 'pending',
      format: dto.format ?? ArchiveFormat.ZIP,
      includeAttachments: dto.includeAttachments ?? true,
      requestedAt: new Date(),
      estimatedCompletionAt: new Date(Date.now() + 7200000),
    };
  }
}
