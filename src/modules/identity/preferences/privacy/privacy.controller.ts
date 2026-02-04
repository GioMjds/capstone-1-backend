import { Controller, Get, Put, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import {
  GetComplianceSettingsUseCase,
  UpdateComplianceSettingsUseCase,
  GetProfileVisibilityUseCase,
  UpdateProfileVisibilityUseCase,
  GetActivityVisibilityUseCase,
  UpdateActivityVisibilityUseCase,
  GetOnlinePresenceSettingsUseCase,
  UpdateOnlinePresenceSettingsUseCase,
  GetFieldLevelVisibilityUseCase,
  UpdateFieldLevelVisibilityUseCase,
} from '@/application/use-cases/identity/preferences';
import {
  SetProfileVisibilityDto,
  SetProfileVisibilityResponseDto,
  SetActivityVisibilityDto,
  SetActivityVisibilityResponseDto,
  SetOnlinePresenceDto,
  SetOnlinePresenceResponseDto,
  SetFieldLevelVisibilityDto,
  SetFieldLevelVisibilityResponseDto,
} from '@/application/dto/identity/preferences';

@ApiTags('Preferences - Privacy')
@ApiBearerAuth()
@Controller('preferences/privacy')
export class PrivacyController {
  constructor(
    private readonly getComplianceSettingsUseCase: GetComplianceSettingsUseCase,
    private readonly updateComplianceSettingsUseCase: UpdateComplianceSettingsUseCase,
    private readonly getProfileVisibilityUseCase: GetProfileVisibilityUseCase,
    private readonly updateProfileVisibilityUseCase: UpdateProfileVisibilityUseCase,
    private readonly getActivityVisibilityUseCase: GetActivityVisibilityUseCase,
    private readonly updateActivityVisibilityUseCase: UpdateActivityVisibilityUseCase,
    private readonly getOnlinePresenceSettingsUseCase: GetOnlinePresenceSettingsUseCase,
    private readonly updateOnlinePresenceSettingsUseCase: UpdateOnlinePresenceSettingsUseCase,
    private readonly getFieldLevelVisibilityUseCase: GetFieldLevelVisibilityUseCase,
    private readonly updateFieldLevelVisibilityUseCase: UpdateFieldLevelVisibilityUseCase,
  ) {}

  @Get('compliance')
  @ApiOperation({ summary: 'Get compliance settings' })
  async getComplianceSettings() {
    return this.getComplianceSettingsUseCase.execute();
  }

  @Put('compliance')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update compliance settings' })
  async updateComplianceSettings(@Body() dto: any) {
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
    @Body() dto: SetProfileVisibilityDto,
  ): Promise<SetProfileVisibilityResponseDto> {
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
    @Body() dto: SetActivityVisibilityDto,
  ): Promise<SetActivityVisibilityResponseDto> {
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
    @Body() dto: SetOnlinePresenceDto,
  ): Promise<SetOnlinePresenceResponseDto> {
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
    @Body() dto: SetFieldLevelVisibilityDto,
  ): Promise<SetFieldLevelVisibilityResponseDto> {
    return this.updateFieldLevelVisibilityUseCase.execute(dto);
  }
}
