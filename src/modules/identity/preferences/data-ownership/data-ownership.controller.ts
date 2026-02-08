import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import * as DataOwnershipUseCase from '@/application/use-cases/identity/preferences/data-ownership';
import * as DataOwnershipDto from '@/application/dto/identity/preferences/data-ownership';
import { JwtAuthGuard } from '@/shared/guards';

@ApiTags('Preferences - Data Ownership')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('preferences/data-ownership')
export class DataOwnershipController {
  constructor(
    private readonly exportPersonalDataUseCase: DataOwnershipUseCase.ExportPersonalDataUseCase,
    private readonly exportActivityHistoryUseCase: DataOwnershipUseCase.ExportActivityHistoryUseCase,
    private readonly downloadAccountArchiveUseCase: DataOwnershipUseCase.DownloadAccountArchiveUseCase,
    private readonly requestDataDeletionUseCase: DataOwnershipUseCase.RequestDataDeletionUseCase,
    private readonly requestDataCorrectionUseCase: DataOwnershipUseCase.RequestDataCorrectionUseCase,
    private readonly anonymizeDataUseCase: DataOwnershipUseCase.AnonymizeDataUseCase,
    private readonly setExportFormatUseCase: DataOwnershipUseCase.SetExportFormatUseCase,
  ) {}

  @Post('export-personal-data')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Export personal data' })
  async exportPersonalData(
    @Body() dto: DataOwnershipDto.ExportPersonalDataDto,
  ): Promise<DataOwnershipDto.DataExportResponseDto> {
    return this.exportPersonalDataUseCase.execute(dto);
  }

  @Post('export-activity-history')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Export activity history' })
  async exportActivityHistory(
    @Body() dto: DataOwnershipDto.ExportActivityHistoryDto,
  ): Promise<DataOwnershipDto.DataExportResponseDto> {
    return this.exportActivityHistoryUseCase.execute(dto);
  }

  @Get('download-archive')
  @ApiOperation({ summary: 'Download account archive' })
  async downloadAccountArchive(
    @Body() dto: DataOwnershipDto.DownloadAccountArchiveDto,
  ): Promise<DataOwnershipDto.AccountArchiveResponseDto> {
    return this.downloadAccountArchiveUseCase.execute(dto);
  }

  @Post('request-deletion')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Request data deletion (GDPR)' })
  async requestDataDeletion(
    @Body() dto: DataOwnershipDto.RequestDataDeletionDto,
  ): Promise<DataOwnershipDto.DataDeletionResponseDto> {
    return this.requestDataDeletionUseCase.execute(dto);
  }

  @Post('request-correction')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Request data correction' })
  async requestDataCorrection(
    @Body() dto: DataOwnershipDto.RequestDataCorrectionDto,
  ): Promise<DataOwnershipDto.DataCorrectionResponseDto> {
    return this.requestDataCorrectionUseCase.execute(dto);
  }

  @Post('anonymize')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Anonymize data' })
  async anonymizeData(
    @Body() dto: DataOwnershipDto.AnonymizeDataDto,
  ): Promise<DataOwnershipDto.AnonymizationResponseDto> {
    return this.anonymizeDataUseCase.execute(dto);
  }

  @Put('export-format')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Set preferred export format' })
  async setExportFormat(
    @Body() dto: DataOwnershipDto.SetExportFormatDto,
  ): Promise<DataOwnershipDto.ExportFormatResponseDto> {
    return this.setExportFormatUseCase.execute(dto);
  }
}
