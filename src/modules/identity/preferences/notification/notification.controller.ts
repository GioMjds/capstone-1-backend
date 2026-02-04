import { Controller, Get, Put, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import {
  GetNotificationSettingsUseCase,
  UpdateNotificationSettingsUseCase,
  SetQuietHoursUseCase,
  ManageMarketingOptInUseCase,
  ConfigureEmailNotificationsByCategoryUseCase,
  ConfigurePushNotificationsByCategoryUseCase,
  ConfigureSmsAlertsUseCase,
} from '@/application/use-cases/identity/preferences';
import {
  SetQuietHoursDto,
  SetQuietHoursResponseDto,
  ManageMarketingOptInDto,
  ManageMarketingOptInResponseDto,
  ConfigureEmailNotificationsByCategoryDto,
  ConfigureEmailNotificationsByCategoryResponseDto,
  ConfigurePushNotificationsByCategoryDto,
  ConfigurePushNotificationsByCategoryResponseDto,
  ConfigureSmsAlertsDto,
  ConfigureSmsAlertsResponseDto,
} from '@/application/dto/identity/preferences';

@ApiTags('Preferences - Notifications')
@ApiBearerAuth()
@Controller('preferences/notifications')
export class NotificationController {
  constructor(
    private readonly getNotificationSettingsUseCase: GetNotificationSettingsUseCase,
    private readonly updateNotificationSettingsUseCase: UpdateNotificationSettingsUseCase,
    private readonly setQuietHoursUseCase: SetQuietHoursUseCase,
    private readonly manageMarketingOptInUseCase: ManageMarketingOptInUseCase,
    private readonly configureEmailNotificationsByCategoryUseCase: ConfigureEmailNotificationsByCategoryUseCase,
    private readonly configurePushNotificationsByCategoryUseCase: ConfigurePushNotificationsByCategoryUseCase,
    private readonly configureSmsAlertsUseCase: ConfigureSmsAlertsUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get notification settings' })
  async getNotificationSettings() {
    return this.getNotificationSettingsUseCase.execute();
  }

  @Put()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update notification settings' })
  async updateNotificationSettings(@Body() dto: any) {
    return this.updateNotificationSettingsUseCase.execute(dto);
  }

  @Put('quiet-hours')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Set quiet hours' })
  async setQuietHours(@Body() dto: SetQuietHoursDto): Promise<SetQuietHoursResponseDto> {
    return this.setQuietHoursUseCase.execute(dto);
  }

  @Put('marketing-opt-in')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Manage marketing opt-in preferences' })
  async manageMarketingOptIn(
    @Body() dto: ManageMarketingOptInDto,
  ): Promise<ManageMarketingOptInResponseDto> {
    return this.manageMarketingOptInUseCase.execute(dto);
  }

  @Put('email-by-category')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Configure email notifications by category' })
  async configureEmailNotificationsByCategory(
    @Body() dto: ConfigureEmailNotificationsByCategoryDto,
  ): Promise<ConfigureEmailNotificationsByCategoryResponseDto> {
    return this.configureEmailNotificationsByCategoryUseCase.execute(dto);
  }

  @Put('push-by-category')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Configure push notifications by category' })
  async configurePushNotificationsByCategory(
    @Body() dto: ConfigurePushNotificationsByCategoryDto,
  ): Promise<ConfigurePushNotificationsByCategoryResponseDto> {
    return this.configurePushNotificationsByCategoryUseCase.execute(dto);
  }

  @Put('sms-alerts')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Configure SMS alerts' })
  async configureSmsAlerts(
    @Body() dto: ConfigureSmsAlertsDto,
  ): Promise<ConfigureSmsAlertsResponseDto> {
    return this.configureSmsAlertsUseCase.execute(dto);
  }
}
