import { Controller, Get, Post, Put, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import {
  ExportPersonalDataUseCase,
  ExportActivityHistoryUseCase,
  DownloadAccountArchiveUseCase,
  RequestDataDeletionUseCase,
  RequestDataCorrectionUseCase,
  AnonymizeDataUseCase,
  SetExportFormatUseCase,
} from '@/application/use-cases/identity/preferences';
import {
  ExportPersonalDataDto,
  ExportPersonalDataResponseDto,
  ExportActivityHistoryDto,
  ExportActivityHistoryResponseDto,
  DownloadAccountArchiveResponseDto,
  RequestDataDeletionDto,
  RequestDataDeletionResponseDto,
  RequestDataCorrectionDto,
  RequestDataCorrectionResponseDto,
  AnonymizeDataDto,
  AnonymizeDataResponseDto,
  SetExportFormatDto,
  SetExportFormatResponseDto,
} from '@/application/dto/identity/preferences';

@ApiTags('Preferences - Data Ownership')
@ApiBearerAuth()
@Controller('preferences/data-ownership')
export class DataOwnershipController {
  constructor(
    private readonly exportPersonalDataUseCase: ExportPersonalDataUseCase,
    private readonly exportActivityHistoryUseCase: ExportActivityHistoryUseCase,
    private readonly downloadAccountArchiveUseCase: DownloadAccountArchiveUseCase,
    private readonly requestDataDeletionUseCase: RequestDataDeletionUseCase,
    private readonly requestDataCorrectionUseCase: RequestDataCorrectionUseCase,
    private readonly anonymizeDataUseCase: AnonymizeDataUseCase,
    private readonly setExportFormatUseCase: SetExportFormatUseCase,
  ) {}

  @Post('export-personal-data')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Export personal data' })
  async exportPersonalData(
    @Body() dto: ExportPersonalDataDto,
  ): Promise<ExportPersonalDataResponseDto> {
    return this.exportPersonalDataUseCase.execute(dto);
  }

  @Post('export-activity-history')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Export activity history' })
  async exportActivityHistory(
    @Body() dto: ExportActivityHistoryDto,
  ): Promise<ExportActivityHistoryResponseDto> {
    return this.exportActivityHistoryUseCase.execute(dto);
  }

  @Get('download-archive')
  @ApiOperation({ summary: 'Download account archive' })
  async downloadAccountArchive(): Promise<DownloadAccountArchiveResponseDto> {
    return this.downloadAccountArchiveUseCase.execute();
  }

  @Post('request-deletion')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Request data deletion (GDPR)' })
  async requestDataDeletion(
    @Body() dto: RequestDataDeletionDto,
  ): Promise<RequestDataDeletionResponseDto> {
    return this.requestDataDeletionUseCase.execute(dto);
  }

  @Post('request-correction')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Request data correction' })
  async requestDataCorrection(
    @Body() dto: RequestDataCorrectionDto,
  ): Promise<RequestDataCorrectionResponseDto> {
    return this.requestDataCorrectionUseCase.execute(dto);
  }

  @Post('anonymize')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Anonymize data' })
  async anonymizeData(@Body() dto: AnonymizeDataDto): Promise<AnonymizeDataResponseDto> {
    return this.anonymizeDataUseCase.execute(dto);
  }

  @Put('export-format')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Set preferred export format' })
  async setExportFormat(
    @Body() dto: SetExportFormatDto,
  ): Promise<SetExportFormatResponseDto> {
    return this.setExportFormatUseCase.execute(dto);
  }
}
