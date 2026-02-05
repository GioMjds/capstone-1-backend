import {
  Controller,
  Get,
  Put,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import * as PrivacyDto from '@/application/dto/identity/preferences/privacy';
import * as PrivacyUseCase from '@/application/use-cases/identity/preferences/privacy';

@ApiTags('Preferences - Privacy')
@ApiBearerAuth()
@Controller('preferences/privacy')
export class PrivacyController {
  constructor(
    private readonly getComplianceSettingsUseCase: PrivacyUseCase.GetComplianceSettingsUseCase,
    private readonly updateComplianceSettingsUseCase: PrivacyUseCase.UpdateComplianceSettingsUseCase,
    private readonly getProfileVisibilityUseCase: PrivacyUseCase.GetProfileVisibilityUseCase,
    private readonly updateProfileVisibilityUseCase: PrivacyUseCase.UpdateProfileVisibilityUseCase,
    private readonly getActivityVisibilityUseCase: PrivacyUseCase.GetActivityVisibilityUseCase,
    private readonly updateActivityVisibilityUseCase: PrivacyUseCase.UpdateActivityVisibilityUseCase,
    private readonly getOnlinePresenceSettingsUseCase: PrivacyUseCase.GetOnlinePresenceSettingsUseCase,
    private readonly updateOnlinePresenceSettingsUseCase: PrivacyUseCase.UpdateOnlinePresenceSettingsUseCase,
    private readonly getFieldLevelVisibilityUseCase: PrivacyUseCase.GetFieldLevelVisibilityUseCase,
    private readonly updateFieldLevelVisibilityUseCase: PrivacyUseCase.UpdateFieldLevelVisibilityUseCase,
  ) {}

  @Get('compliance')
  @ApiOperation({ summary: 'Get compliance settings' })
  async getComplianceSettings() {
    return this.getComplianceSettingsUseCase.execute();
  }

  @Put('compliance')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update compliance settings' })
  async updateComplianceSettings(@Body() dto: PrivacyDto.UpdateComplianceSettingsDto) {
    return this.updateComplianceSettingsUseCase.execute(dto);
  }

  @Get('profile-visibility')
  @ApiOperation({ summary: 'Get profile visibility settings' })
  async getProfileVisibility() {
    return this.getProfileVisibilityUseCase.execute();
  }

  @Put('profile-visibility')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update profile visibility' })
  async updateProfileVisibility(
    @Body() dto: PrivacyDto.SetProfileVisibilityDto,
  ): Promise<PrivacyDto.SetProfileVisibilityResponseDto> {
    return this.updateProfileVisibilityUseCase.execute(dto);
  }

  @Get('activity-visibility')
  @ApiOperation({ summary: 'Get activity visibility settings' })
  async getActivityVisibility() {
    return this.getActivityVisibilityUseCase.execute();
  }

  @Put('activity-visibility')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update activity visibility' })
  async updateActivityVisibility(
    @Body() dto: PrivacyDto.SetActivityVisibilityDto,
  ): Promise<PrivacyDto.SetActivityVisibilityResponseDto> {
    return this.updateActivityVisibilityUseCase.execute(dto);
  }

  @Get('online-presence')
  @ApiOperation({ summary: 'Get online presence settings' })
  async getOnlinePresenceSettings() {
    return this.getOnlinePresenceSettingsUseCase.execute();
  }

  @Put('online-presence')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update online presence settings' })
  async updateOnlinePresenceSettings(
    @Body() dto: PrivacyDto.SetOnlinePresenceDto,
  ): Promise<PrivacyDto.SetOnlinePresenceResponseDto> {
    return this.updateOnlinePresenceSettingsUseCase.execute(dto);
  }

  @Get('field-level-visibility')
  @ApiOperation({ summary: 'Get field-level visibility settings' })
  async getFieldLevelVisibility() {
    return this.getFieldLevelVisibilityUseCase.execute();
  }

  @Put('field-level-visibility')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update field-level visibility' })
  async updateFieldLevelVisibility(
    @Body() dto: PrivacyDto.SetFieldLevelVisibilityDto,
  ): Promise<PrivacyDto.SetFieldLevelVisibilityResponseDto> {
    return this.updateFieldLevelVisibilityUseCase.execute(dto);
  }
}
