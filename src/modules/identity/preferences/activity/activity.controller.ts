import {
  Controller,
  Get,
  Post,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import * as ActivityUseCase from '@/application/use-cases/identity/preferences/activity';
import * as ActivityDto from '@/application/dto/identity/preferences/activity';
import { CurrentUser } from '@/shared/decorators';
import { JwtAuthGuard } from '@/shared/guards';

@ApiTags('Preferences - Activity & Transparency')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('preferences/activity')
export class ActivityController {
  constructor(
    private readonly getLoginHistoryUseCase: ActivityUseCase.GetLoginHistoryUseCase,
    private readonly getSecurityEventsUseCase: ActivityUseCase.GetSecurityEventsUseCase,
    private readonly getAccountChangeHistoryUseCase: ActivityUseCase.GetAccountChangeHistoryUseCase,
    private readonly getPermissionChangeHistoryUseCase: ActivityUseCase.GetPermissionChangeHistoryUseCase,
    private readonly exportAuditLogsUseCase: ActivityUseCase.ExportAuditLogsUseCase,
    private readonly getDataAccessHistoryUseCase: ActivityUseCase.GetDataAccessHistoryUseCase,
    private readonly getPreferenceAuditLogsUseCase: ActivityUseCase.GetPreferenceAuditLogsUseCase,
    private readonly viewActiveSessionsUseCase: ActivityUseCase.ViewActiveSessionsUseCase,
  ) {}

  @Get('login-history')
  @ApiOperation({ summary: 'Get login history' })
  async getLoginHistory(
    @Query() dto: ActivityDto.GetLoginHistoryDto,
  ): Promise<ActivityDto.GetLoginHistoryResponseDto> {
    return this.getLoginHistoryUseCase.execute(dto);
  }

  @Get('security-events')
  @ApiOperation({ summary: 'Get security events' })
  async getSecurityEvents(
    @Query() dto: ActivityDto.GetSecurityEventsDto,
  ): Promise<ActivityDto.GetSecurityEventsResponseDto> {
    return this.getSecurityEventsUseCase.execute(dto);
  }

  @Get('account-changes')
  @ApiOperation({ summary: 'Get account change history' })
  async getAccountChangeHistory(
    @Query() dto: ActivityDto.GetAccountChangeHistoryDto,
  ): Promise<ActivityDto.GetAccountChangeHistoryResponseDto> {
    return this.getAccountChangeHistoryUseCase.execute(dto);
  }

  @Get('permission-changes')
  @ApiOperation({ summary: 'Get permission change history' })
  async getPermissionChangeHistory(
    @Query() dto: ActivityDto.GetPermissionChangeHistoryDto,
  ): Promise<ActivityDto.GetPermissionChangeHistoryResponseDto> {
    return this.getPermissionChangeHistoryUseCase.execute(dto);
  }

  @Post('export-audit-logs')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Export audit logs' })
  async exportAuditLogs(
    @Query() dto: ActivityDto.ExportAuditLogsDto,
  ): Promise<ActivityDto.ExportAuditLogsResponseDto> {
    return this.exportAuditLogsUseCase.execute(dto);
  }

  @Get('data-access-history')
  @ApiOperation({ summary: 'Get data access history' })
  async getDataAccessHistory(
    @Query() dto: ActivityDto.GetDataAccessHistoryDto,
  ): Promise<ActivityDto.GetDataAccessHistoryResponseDto> {
    return this.getDataAccessHistoryUseCase.execute(dto);
  }

  @Get('preference-audit-logs')
  @ApiOperation({ summary: 'Get preference audit logs' })
  async getPreferenceAuditLogs(
    @CurrentUser() userId: string,
  ): Promise<ActivityDto.AuditLogsResponseDto> {
    return this.getPreferenceAuditLogsUseCase.execute(userId);
  }

  @Get('active-sessions')
  @ApiOperation({ summary: 'View active sessions' })
  async viewActiveSessions(@CurrentUser() userId: string) {
    return this.viewActiveSessionsUseCase.execute(userId);
  }
}
