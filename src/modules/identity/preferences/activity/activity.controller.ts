import { Controller, Get, Post, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import {
  GetLoginHistoryUseCase,
  GetSecurityEventsUseCase,
  GetAccountChangeHistoryUseCase,
  GetPermissionChangeHistoryUseCase,
  ExportAuditLogsUseCase,
  GetDataAccessHistoryUseCase,
  GetPreferenceAuditLogsUseCase,
  ViewActiveSessionsUseCase,
} from '@/application/use-cases/identity/preferences';
import {
  GetLoginHistoryDto,
  GetLoginHistoryResponseDto,
  GetSecurityEventsDto,
  GetSecurityEventsResponseDto,
  GetAccountChangeHistoryDto,
  GetAccountChangeHistoryResponseDto,
  GetPermissionChangeHistoryDto,
  GetPermissionChangeHistoryResponseDto,
  ExportAuditLogsDto,
  ExportAuditLogsResponseDto,
  GetDataAccessHistoryDto,
  GetDataAccessHistoryResponseDto,
} from '@/application/dto/identity/preferences';

@ApiTags('Preferences - Activity & Transparency')
@ApiBearerAuth()
@Controller('preferences/activity')
export class ActivityController {
  constructor(
    private readonly getLoginHistoryUseCase: GetLoginHistoryUseCase,
    private readonly getSecurityEventsUseCase: GetSecurityEventsUseCase,
    private readonly getAccountChangeHistoryUseCase: GetAccountChangeHistoryUseCase,
    private readonly getPermissionChangeHistoryUseCase: GetPermissionChangeHistoryUseCase,
    private readonly exportAuditLogsUseCase: ExportAuditLogsUseCase,
    private readonly getDataAccessHistoryUseCase: GetDataAccessHistoryUseCase,
    private readonly getPreferenceAuditLogsUseCase: GetPreferenceAuditLogsUseCase,
    private readonly viewActiveSessionsUseCase: ViewActiveSessionsUseCase,
  ) {}

  @Get('login-history')
  @ApiOperation({ summary: 'Get login history' })
  async getLoginHistory(
    @Query() dto: GetLoginHistoryDto,
  ): Promise<GetLoginHistoryResponseDto> {
    return this.getLoginHistoryUseCase.execute(dto);
  }

  @Get('security-events')
  @ApiOperation({ summary: 'Get security events' })
  async getSecurityEvents(
    @Query() dto: GetSecurityEventsDto,
  ): Promise<GetSecurityEventsResponseDto> {
    return this.getSecurityEventsUseCase.execute(dto);
  }

  @Get('account-changes')
  @ApiOperation({ summary: 'Get account change history' })
  async getAccountChangeHistory(
    @Query() dto: GetAccountChangeHistoryDto,
  ): Promise<GetAccountChangeHistoryResponseDto> {
    return this.getAccountChangeHistoryUseCase.execute(dto);
  }

  @Get('permission-changes')
  @ApiOperation({ summary: 'Get permission change history' })
  async getPermissionChangeHistory(
    @Query() dto: GetPermissionChangeHistoryDto,
  ): Promise<GetPermissionChangeHistoryResponseDto> {
    return this.getPermissionChangeHistoryUseCase.execute(dto);
  }

  @Post('export-audit-logs')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Export audit logs' })
  async exportAuditLogs(
    @Query() dto: ExportAuditLogsDto,
  ): Promise<ExportAuditLogsResponseDto> {
    return this.exportAuditLogsUseCase.execute(dto);
  }

  @Get('data-access-history')
  @ApiOperation({ summary: 'Get data access history' })
  async getDataAccessHistory(
    @Query() dto: GetDataAccessHistoryDto,
  ): Promise<GetDataAccessHistoryResponseDto> {
    return this.getDataAccessHistoryUseCase.execute(dto);
  }

  @Get('preference-audit-logs')
  @ApiOperation({ summary: 'Get preference audit logs' })
  async getPreferenceAuditLogs() {
    return this.getPreferenceAuditLogsUseCase.execute();
  }

  @Get('active-sessions')
  @ApiOperation({ summary: 'View active sessions' })
  async viewActiveSessions() {
    return this.viewActiveSessionsUseCase.execute();
  }
}
