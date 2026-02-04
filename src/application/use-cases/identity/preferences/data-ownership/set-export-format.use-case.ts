import { Injectable } from '@nestjs/common';
import {
  SetExportFormatDto,
  ExportFormatResponseDto,
} from '@/application/dto/identity/preferences';

@Injectable()
export class SetExportFormatUseCase {
  constructor() {}

  async execute(dto: SetExportFormatDto): Promise<ExportFormatResponseDto> {
    return {
      defaultFormat: dto.format,
      updatedAt: new Date(),
    };
  }
}
