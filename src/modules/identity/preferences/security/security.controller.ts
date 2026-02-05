import {
  Controller,
  Get,
  Put,
  Post,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import * as SecurityUseCase from '@/application/use-cases/identity/preferences/security';
import * as SecurityDto from '@/application/dto/identity/preferences/security';
import { CurrentUser, JwtPayload } from '@/shared/decorators';

@ApiTags('Preferences - Security')
@ApiBearerAuth()
@Controller('preferences/security')
export class SecurityController {
  constructor(
    private readonly getSecuritySettingsUseCase: SecurityUseCase.GetSecuritySettingsUseCase,
    private readonly updateSecuritySettingsUseCase: SecurityUseCase.UpdateSecuritySettingsUseCase,
    private readonly multiFactorAuthUseCase: SecurityUseCase.MultiFactorAuthUseCase,
    private readonly selectMfaMethodUseCase: SecurityUseCase.SelectMfaMethodUseCase,
    private readonly regenerateBackupCodesUseCase: SecurityUseCase.RegenerateBackupCodesUseCase,
    private readonly manageTrustedDevicesUseCase: SecurityUseCase.ManageTrustedDevicesUseCase,
    private readonly configureLoginAlertsUseCase: SecurityUseCase.ConfigureLoginAlertsUseCase,
    private readonly configureSuspiciousActivityAlertsUseCase: SecurityUseCase.ConfigureSuspiciousActivityAlertsUseCase,
    private readonly setPasswordRotationReminderUseCase: SecurityUseCase.SetPasswordRotationReminderUseCase,
    private readonly setSessionExpirationUseCase: SecurityUseCase.SetSessionExpirationUseCase,
    private readonly configureIpRestrictionsUseCase: SecurityUseCase.ConfigureIpRestrictionsUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get security settings' })
  async getSecuritySettings(
    @CurrentUser() userId: JwtPayload
  ) {
    return this.getSecuritySettingsUseCase.execute(userId.sub);
  }

  @Put()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update security settings' })
  async updateSecuritySettings(@Body() dto: SecurityDto.UpdateSecuritySettingsDto) {
    return this.updateSecuritySettingsUseCase.execute(dto);
  }

  @Get('mfa')
  @ApiOperation({ summary: 'Get MFA settings' })
  async getMfaSettings() {
    return this.multiFactorAuthUseCase.execute();
  }

  @Put('mfa/method')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Select MFA method' })
  async selectMfaMethod(
    @Body() dto: SecurityDto.SelectMfaMethodDto,
  ): Promise<SecurityDto.SelectMfaMethodResponseDto> {
    return this.selectMfaMethodUseCase.execute(dto);
  }

  @Post('mfa/backup-codes/regenerate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Regenerate backup codes' })
  async regenerateBackupCodes(): Promise<SecurityDto.RegenerateBackupCodesResponseDto> {
    return this.regenerateBackupCodesUseCase.execute();
  }

  @Get('trusted-devices')
  @ApiOperation({ summary: 'Get trusted devices' })
  async getTrustedDevices(): Promise<SecurityDto.ManageTrustedDevicesResponseDto> {
    return this.manageTrustedDevicesUseCase.getAll();
  }

  @Post('trusted-devices')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Add trusted device' })
  async addTrustedDevice(
    @Body() dto: SecurityDto.AddTrustedDeviceDto,
  ): Promise<SecurityDto.ManageTrustedDevicesResponseDto> {
    return this.manageTrustedDevicesUseCase.add(dto);
  }

  @Delete('trusted-devices/:deviceId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove trusted device' })
  async removeTrustedDevice(
    @Param('deviceId') deviceId: string,
  ): Promise<void> {
    return this.manageTrustedDevicesUseCase.remove(deviceId);
  }

  @Put('login-alerts')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Configure login alerts' })
  async configureLoginAlerts(
    @Body() dto: SecurityDto.ConfigureLoginAlertsDto,
  ): Promise<SecurityDto.ConfigureLoginAlertsResponseDto> {
    return this.configureLoginAlertsUseCase.execute(dto);
  }

  @Put('suspicious-activity-alerts')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Configure suspicious activity alerts' })
  async configureSuspiciousActivityAlerts(
    @Body() dto: SecurityDto.ConfigureSuspiciousActivityAlertsDto,
  ): Promise<SecurityDto.ConfigureSuspiciousActivityAlertsResponseDto> {
    return this.configureSuspiciousActivityAlertsUseCase.execute(dto);
  }

  @Put('password-rotation-reminder')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Set password rotation reminder' })
  async setPasswordRotationReminder(
    @Body() dto: SecurityDto.SetPasswordRotationReminderDto,
  ): Promise<SecurityDto.SetPasswordRotationReminderResponseDto> {
    return this.setPasswordRotationReminderUseCase.execute(dto);
  }

  @Put('session-expiration')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Set session expiration' })
  async setSessionExpiration(
    @Body() dto: SecurityDto.SetSessionExpirationDto,
  ): Promise<SecurityDto.SetSessionExpirationResponseDto> {
    return this.setSessionExpirationUseCase.execute(dto);
  }

  @Put('ip-restrictions')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Configure IP restrictions' })
  async configureIpRestrictions(
    @Body() dto: SecurityDto.ConfigureIpRestrictionsDto,
  ): Promise<SecurityDto.ConfigureIpRestrictionsResponseDto> {
    return this.configureIpRestrictionsUseCase.execute(dto);
  }
}
