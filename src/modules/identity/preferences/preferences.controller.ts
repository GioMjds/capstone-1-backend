import { JwtAuthGuard } from '@/shared/guards';
import {
  Controller,
  Get,
  Patch,
  HttpCode,
  HttpStatus,
  UseGuards,
  Body,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiSecurity } from '@nestjs/swagger';
import { CurrentUser as CurrentUserDecorator } from '@/shared/decorators/current-user.decorator';
import * as PreferenceUseCase from '@/application/use-cases/identity/preferences';
import * as UserPreferenceDto from '@/application/dto/identity/preferences';

@UseGuards(JwtAuthGuard)
@ApiSecurity('bearer')
@ApiTags('Preferences')
@Controller('preferences')
export class UserPreferencesController {
  constructor(
    private readonly updateUiPreferencesUseCase: PreferenceUseCase.UpdateUiPreferencesUseCase,
    private readonly getUiPreferencesUseCase: PreferenceUseCase.GetUiPreferencesUseCase,
    private readonly getNotificationSettingsUseCase: PreferenceUseCase.GetNotificationSettingsUseCase,
    private readonly updateNotificationSettingsUseCase: PreferenceUseCase.UpdateNotificationSettingsUseCase,
    private readonly getSecuritySettingsUseCase: PreferenceUseCase.GetSecuritySettingsUseCase,
    private readonly updateSecuritySettingsUseCase: PreferenceUseCase.UpdateSecuritySettingsUseCase,
    private readonly getComplianceSettingsUseCase: PreferenceUseCase.GetComplianceSettingsUseCase,
    private readonly updateComplianceSettingsUseCase: PreferenceUseCase.UpdateComplianceSettingsUseCase,
    private readonly getPreferenceAuditLogsUseCase: PreferenceUseCase.GetPreferenceAuditLogsUseCase,
  ) {}

  @Get('ui')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get UI preferences' })
  async getUiPreferences(
    @CurrentUserDecorator() userId: string,
  ): Promise<UserPreferenceDto.UiPreferencesResponseDto> {
    return this.getUiPreferencesUseCase.execute(userId);
  }

  @Patch('ui')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update UI preferences' })
  async updateUiPreferences(
    @CurrentUserDecorator() userId: string,
    @Body() dto: UserPreferenceDto.UpdateUiPreferencesDto,
  ): Promise<UserPreferenceDto.UiPreferencesResponseDto> {
    const uiPreferences = await this.updateUiPreferencesUseCase.execute(
      userId,
      dto,
    );

    return {
      theme: uiPreferences.getTheme(),
      language: uiPreferences.getLanguage(),
      timezone: uiPreferences.getTimezone(),
      locale: uiPreferences.getLocale(),
    };
  }

  @Get('notifications')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get notification settings' })
  async getNotificationSettings(
    @CurrentUserDecorator() userId: string,
  ): Promise<UserPreferenceDto.NotificationSettingsResponseDto> {
    return this.getNotificationSettingsUseCase.execute(userId);
  }

  @Patch('notifications')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update notification settings' })
  async updateNotificationSettings(
    @CurrentUserDecorator() userId: string,
    @Body() dto: UserPreferenceDto.UpdateNotificationSettingsDto,
  ): Promise<UserPreferenceDto.NotificationSettingsResponseDto> {
    const notificationSettings =
      await this.updateNotificationSettingsUseCase.execute(userId, dto);

    return {
      emailNotifications: notificationSettings.isEmailNotificationsEnabled(),
      pushNotifications: notificationSettings.isPushNotificationsEnabled(),
      smsNotifications: notificationSettings.isSmsNotificationsEnabled(),
      digestFrequency: notificationSettings.getDigestFrequency(),
      quietHoursStart: notificationSettings.getQuietHours().start,
      quietHoursEnd: notificationSettings.getQuietHours().end,
      securityAlerts: notificationSettings.areSecurityAlertsEnabled(),
    };
  }

  @Get('security')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get security settings' })
  async getSecuritySettings(
    @CurrentUserDecorator() userId: string,
  ): Promise<UserPreferenceDto.SecuritySettingsResponseDto> {
    return this.getSecuritySettingsUseCase.execute(userId);
  }

  @Patch('security')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update security settings' })
  async updateSecurity(
    @CurrentUserDecorator() userId: string,
    @Body() dto: UserPreferenceDto.UpdateSecuritySettingsDto,
  ): Promise<UserPreferenceDto.SecuritySettingsResponseDto> {
    const securitySettings = await this.updateSecuritySettingsUseCase.execute(
      userId,
      dto,
    );

    return {
      twoFactorEnabled: securitySettings.isTwoFactorEnabled(),
      twoFactorMethod: securitySettings.getTwoFactorMethod(),
      passkeysEnabled: securitySettings.arePasskeysEnabled(),
      passwordChangedAt: securitySettings.getPasswordChangedAt(),
      activeSessions: securitySettings.getActiveSessions() as any,
      trustedDevices: securitySettings.getTrustedDevices() as any,
    };
  }

  @Get('compliance')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get compliance settings' })
  async getComplianceSettings(
    @CurrentUserDecorator() userId: string,
  ): Promise<UserPreferenceDto.ComplianceSettingsResponseDto> {
    return this.getComplianceSettingsUseCase.execute(userId);
  }

  @Patch('compliance')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update compliance settings' })
  async updateCompliance(
    @CurrentUserDecorator() userId: string,
    @Body() dto: UserPreferenceDto.UpdateComplianceSettingsDto,
  ): Promise<UserPreferenceDto.ComplianceSettingsResponseDto> {
    const complianceSettings =
      await this.updateComplianceSettingsUseCase.execute(userId, dto);

    return {
      dataShareConsent: complianceSettings.isDataShareConsentGiven(),
      dataRetentionMonths: complianceSettings.getDataRetentionMonths(),
      allowAccountDeletion: complianceSettings.isAccountDeletionAllowed(),
      auditLogPreference: complianceSettings.getAuditLogPreference(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  @Get('audit-logs')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get preference audit logs' })
  async getAuditLogs(
    @CurrentUserDecorator() userId: string,
    @Query() query: UserPreferenceDto.PreferenceAuditLogsQueryDto,
  ): Promise<UserPreferenceDto.AuditLogsResponseDto> {
    return this.getPreferenceAuditLogsUseCase.execute(
      userId,
      query.page ?? 1,
      query.limit ?? 20,
      query.category,
    );
  }
}
