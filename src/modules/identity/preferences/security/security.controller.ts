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
import {
  GetSecuritySettingsUseCase,
  UpdateSecuritySettingsUseCase,
  MultiFactorAuthUseCase,
  SelectMfaMethodUseCase,
  RegenerateBackupCodesUseCase,
  ManageTrustedDevicesUseCase,
  ConfigureLoginAlertsUseCase,
  ConfigureSuspiciousActivityAlertsUseCase,
  SetPasswordRotationReminderUseCase,
  SetSessionExpirationUseCase,
  ConfigureIpRestrictionsUseCase,
} from '@/application/use-cases/identity/preferences';
import {
  SelectMfaMethodDto,
  SelectMfaMethodResponseDto,
  RegenerateBackupCodesResponseDto,
  AddTrustedDeviceDto,
  ManageTrustedDevicesResponseDto,
  ConfigureLoginAlertsDto,
  ConfigureLoginAlertsResponseDto,
  ConfigureSuspiciousActivityAlertsDto,
  ConfigureSuspiciousActivityAlertsResponseDto,
  SetPasswordRotationReminderDto,
  SetPasswordRotationReminderResponseDto,
  SetSessionExpirationDto,
  SetSessionExpirationResponseDto,
  ConfigureIpRestrictionsDto,
  ConfigureIpRestrictionsResponseDto,
} from '@/application/dto/identity/preferences';

@ApiTags('Preferences - Security')
@ApiBearerAuth()
@Controller('preferences/security')
export class SecurityController {
  constructor(
    private readonly getSecuritySettingsUseCase: GetSecuritySettingsUseCase,
    private readonly updateSecuritySettingsUseCase: UpdateSecuritySettingsUseCase,
    private readonly multiFactorAuthUseCase: MultiFactorAuthUseCase,
    private readonly selectMfaMethodUseCase: SelectMfaMethodUseCase,
    private readonly regenerateBackupCodesUseCase: RegenerateBackupCodesUseCase,
    private readonly manageTrustedDevicesUseCase: ManageTrustedDevicesUseCase,
    private readonly configureLoginAlertsUseCase: ConfigureLoginAlertsUseCase,
    private readonly configureSuspiciousActivityAlertsUseCase: ConfigureSuspiciousActivityAlertsUseCase,
    private readonly setPasswordRotationReminderUseCase: SetPasswordRotationReminderUseCase,
    private readonly setSessionExpirationUseCase: SetSessionExpirationUseCase,
    private readonly configureIpRestrictionsUseCase: ConfigureIpRestrictionsUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get security settings' })
  async getSecuritySettings() {
    return this.getSecuritySettingsUseCase.execute();
  }

  @Put()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update security settings' })
  async updateSecuritySettings(@Body() dto: any) {
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
    @Body() dto: SelectMfaMethodDto,
  ): Promise<SelectMfaMethodResponseDto> {
    return this.selectMfaMethodUseCase.execute(dto);
  }

  @Post('mfa/backup-codes/regenerate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Regenerate backup codes' })
  async regenerateBackupCodes(): Promise<RegenerateBackupCodesResponseDto> {
    return this.regenerateBackupCodesUseCase.execute();
  }

  @Get('trusted-devices')
  @ApiOperation({ summary: 'Get trusted devices' })
  async getTrustedDevices(): Promise<ManageTrustedDevicesResponseDto> {
    return this.manageTrustedDevicesUseCase.getAll();
  }

  @Post('trusted-devices')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Add trusted device' })
  async addTrustedDevice(
    @Body() dto: AddTrustedDeviceDto,
  ): Promise<ManageTrustedDevicesResponseDto> {
    return this.manageTrustedDevicesUseCase.add(dto);
  }

  @Delete('trusted-devices/:deviceId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove trusted device' })
  async removeTrustedDevice(@Param('deviceId') deviceId: string): Promise<void> {
    return this.manageTrustedDevicesUseCase.remove(deviceId);
  }

  @Put('login-alerts')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Configure login alerts' })
  async configureLoginAlerts(
    @Body() dto: ConfigureLoginAlertsDto,
  ): Promise<ConfigureLoginAlertsResponseDto> {
    return this.configureLoginAlertsUseCase.execute(dto);
  }

  @Put('suspicious-activity-alerts')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Configure suspicious activity alerts' })
  async configureSuspiciousActivityAlerts(
    @Body() dto: ConfigureSuspiciousActivityAlertsDto,
  ): Promise<ConfigureSuspiciousActivityAlertsResponseDto> {
    return this.configureSuspiciousActivityAlertsUseCase.execute(dto);
  }

  @Put('password-rotation-reminder')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Set password rotation reminder' })
  async setPasswordRotationReminder(
    @Body() dto: SetPasswordRotationReminderDto,
  ): Promise<SetPasswordRotationReminderResponseDto> {
    return this.setPasswordRotationReminderUseCase.execute(dto);
  }

  @Put('session-expiration')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Set session expiration' })
  async setSessionExpiration(
    @Body() dto: SetSessionExpirationDto,
  ): Promise<SetSessionExpirationResponseDto> {
    return this.setSessionExpirationUseCase.execute(dto);
  }

  @Put('ip-restrictions')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Configure IP restrictions' })
  async configureIpRestrictions(
    @Body() dto: ConfigureIpRestrictionsDto,
  ): Promise<ConfigureIpRestrictionsResponseDto> {
    return this.configureIpRestrictionsUseCase.execute(dto);
  }
}
