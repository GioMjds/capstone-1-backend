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
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import * as SecurityUseCase from '@/application/use-cases/identity/preferences/security';
import * as SecurityDto from '@/application/dto/identity/preferences/security';
import { CurrentUser, JwtPayload } from '@/shared/decorators';
import { JwtAuthGuard } from '@/shared/guards';

@ApiTags('Preferences - Security')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
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
  async getSecuritySettings(@CurrentUser() userId: JwtPayload) {
    return this.getSecuritySettingsUseCase.execute(userId.sub);
  }

  @Put()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update security settings' })
  async updateSecuritySettings(
    @CurrentUser() user: JwtPayload,
    @Body() dto: SecurityDto.UpdateSecuritySettingsDto,
  ) {
    return this.updateSecuritySettingsUseCase.execute(user.sub, dto);
  }

  @Get('mfa')
  @ApiOperation({ summary: 'Get MFA settings' })
  async getMfaSettings(@CurrentUser() user: JwtPayload) {
    return this.getSecuritySettingsUseCase.execute(user.sub);
  }

  @Put('mfa/method')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Select MFA method' })
  async selectMfaMethod(
    @CurrentUser() user: JwtPayload,
    @Body() dto: SecurityDto.SelectMfaMethodDto,
  ): Promise<SecurityDto.SelectMfaMethodResponseDto> {
    return this.selectMfaMethodUseCase.execute(user.sub, dto);
  }

  @Post('mfa/backup-codes/regenerate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Regenerate backup codes' })
  async regenerateBackupCodes(
    @CurrentUser() user: JwtPayload,
  ): Promise<SecurityDto.BackupCodesResponseDto> {
    return this.regenerateBackupCodesUseCase.execute(user.sub);
  }

  @Get('trusted-devices')
  @ApiOperation({ summary: 'Get trusted devices' })
  async getTrustedDevices(
    @CurrentUser() user: JwtPayload,
  ): Promise<SecurityDto.TrustedDevicesResponseDto> {
    return this.manageTrustedDevicesUseCase.execute(user.sub, {
      action: SecurityDto.TrustedDeviceAction.VERIFY,
    } as SecurityDto.ManageTrustedDevicesDto);
  }

  @Post('trusted-devices')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Add trusted device' })
  async addTrustedDevice(
    @CurrentUser() user: JwtPayload,
    @Body() dto: SecurityDto.ManageTrustedDevicesDto,
  ): Promise<SecurityDto.TrustedDevicesResponseDto> {
    return this.manageTrustedDevicesUseCase.execute(user.sub, dto);
  }

  @Delete('trusted-devices/:deviceId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove trusted device' })
  async removeTrustedDevice(
    @CurrentUser() user: JwtPayload,
    @Param('deviceId') deviceId: string,
  ): Promise<void> {
    await this.manageTrustedDevicesUseCase.execute(user.sub, {
      deviceId,
      action: SecurityDto.TrustedDeviceAction.REMOVE,
    } as SecurityDto.ManageTrustedDevicesDto);
  }

  @Put('login-alerts')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Configure login alerts' })
  async configureLoginAlerts(
    @CurrentUser() user: JwtPayload,
    @Body() dto: SecurityDto.ConfigureLoginAlertsDto,
  ): Promise<SecurityDto.LoginAlertsResponseDto> {
    return this.configureLoginAlertsUseCase.execute(user.sub, dto);
  }

  @Put('suspicious-activity-alerts')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Configure suspicious activity alerts' })
  async configureSuspiciousActivityAlerts(
    @CurrentUser() user: JwtPayload,
    @Body() dto: SecurityDto.ConfigureSuspiciousActivityAlertsDto,
  ): Promise<SecurityDto.SuspiciousActivityAlertsResponseDto> {
    return this.configureSuspiciousActivityAlertsUseCase.execute(user.sub, dto);
  }

  @Put('password-rotation-reminder')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Set password rotation reminder' })
  async setPasswordRotationReminder(
    @CurrentUser() user: JwtPayload,
    @Body() dto: SecurityDto.SetPasswordRotationReminderDto,
  ): Promise<SecurityDto.SetPasswordRotationReminderResponseDto> {
    return this.setPasswordRotationReminderUseCase.execute(user.sub, dto);
  }

  @Put('session-expiration')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Set session expiration' })
  async setSessionExpiration(
    @CurrentUser() user: JwtPayload,
    @Body() dto: SecurityDto.SetSessionExpirationDto,
  ): Promise<SecurityDto.SetSessionExpirationResponseDto> {
    return this.setSessionExpirationUseCase.execute(user.sub, dto);
  }

  @Put('ip-restrictions')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Configure IP restrictions' })
  async configureIpRestrictions(
    @CurrentUser() user: JwtPayload,
    @Body() dto: SecurityDto.ConfigureIpRestrictionsDto,
  ): Promise<SecurityDto.IpRestrictionsResponseDto> {
    return this.configureIpRestrictionsUseCase.execute(user.sub, dto);
  }
}
