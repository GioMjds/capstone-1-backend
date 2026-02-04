import { Injectable } from '@nestjs/common';
import {
  DownloadAccountArchiveDto,
  AccountArchiveResponseDto,
} from '@/application/dto/identity/preferences';

@Injectable()
export class DownloadAccountArchiveUseCase {
  constructor() {}

  async execute(dto: DownloadAccountArchiveDto): Promise<AccountArchiveResponseDto> {
    return {
      archiveId: 'archive-123',
      status: 'pending',
      format: dto.format,
      includeAttachments: dto.includeAttachments,
      requestedAt: new Date(),
      estimatedCompletionAt: new Date(Date.now() + 7200000),
    };
  }
}
