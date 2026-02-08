import {
  Controller,
  Get,
  Put,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import * as PrivacyDto from '@/application/dto/identity/preferences/privacy';
import * as PrivacyUseCase from '@/application/use-cases/identity/preferences/privacy';
import { JwtAuthGuard } from '@/shared/guards';
import { CurrentUser, JwtPayload } from '@/shared/decorators';

@ApiTags('Preferences - Privacy')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
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
  async getComplianceSettings(
    @CurrentUser() userId: JwtPayload
  ) {
    return this.getComplianceSettingsUseCase.execute(userId.sub);
  }

  @Put('compliance')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update compliance settings' })
  async updateComplianceSettings(
    @CurrentUser() userId: JwtPayload,
    @Body() dto: PrivacyDto.UpdateComplianceSettingsDto
  ) {
    return this.updateComplianceSettingsUseCase.execute(userId.sub, dto);
  }

  @Get('profile-visibility')
  @ApiOperation({ summary: 'Get profile visibility settings' })
  async getProfileVisibility(
    @CurrentUser() userId: JwtPayload,
  ) {
    return this.getProfileVisibilityUseCase.execute(userId.sub);
  }

  @Put('profile-visibility')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update profile visibility' })
  async updateProfileVisibility(
    @CurrentUser() userId: JwtPayload,
    @Body() dto: PrivacyDto.UpdateProfileVisibilityDto,
  ): Promise<PrivacyDto.ProfileVisibilityResponseDto> {
    return this.updateProfileVisibilityUseCase.execute(userId.sub, dto);
  }

  @Get('activity-visibility')
  @ApiOperation({ summary: 'Get activity visibility settings' })
  async getActivityVisibility(
    @CurrentUser() userId: JwtPayload,
  ) {
    return this.getActivityVisibilityUseCase.execute(userId.sub);
  }

  @Put('activity-visibility')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update activity visibility' })
  async updateActivityVisibility(
    @CurrentUser() userId: JwtPayload,
    @Body() dto: PrivacyDto.UpdateActivityVisibilityDto,
  ): Promise<PrivacyDto.ActivityVisibilityResponseDto> {
    return this.updateActivityVisibilityUseCase.execute(userId.sub, dto);
  }

  @Get('online-presence')
  @ApiOperation({ summary: 'Get online presence settings' })
  async getOnlinePresenceSettings(
    @CurrentUser() user: JwtPayload,
  ) {
    return this.getOnlinePresenceSettingsUseCase.execute(user.sub);
  }

  @Put('online-presence')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update online presence settings' })
  async updateOnlinePresenceSettings(
    @CurrentUser() user: JwtPayload,
    @Body() dto: PrivacyDto.UpdateOnlinePresenceSettingsDto,
  ): Promise<PrivacyDto.OnlinePresenceSettingsResponseDto> {
    return this.updateOnlinePresenceSettingsUseCase.execute(user.sub, dto);
  }

  @Get('field-level-visibility')
  @ApiOperation({ summary: 'Get field-level visibility settings' })
  async getFieldLevelVisibility(
    @CurrentUser() user: JwtPayload,
  ) {
    return this.getFieldLevelVisibilityUseCase.execute(user.sub);
  }

  @Put('field-level-visibility')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update field-level visibility' })
  async updateFieldLevelVisibility(
    @CurrentUser() user: JwtPayload,
    @Body() dto: PrivacyDto.UpdateFieldLevelVisibilityDto,
  ): Promise<PrivacyDto.FieldLevelVisibilityResponseDto> {
    return this.updateFieldLevelVisibilityUseCase.execute(user.sub, dto);
  }
}
