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
import * as NotificationUseCase from '@/application/use-cases/identity/preferences/notification';
import * as NotificationDto from '@/application/dto/identity/preferences/notification';
import { JwtAuthGuard } from '@/shared/guards';
import { CurrentUser } from '@/shared/decorators';

@ApiTags('Preferences - Notifications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('preferences/notifications')
export class NotificationController {
  constructor(
    private readonly getNotificationSettingsUseCase: NotificationUseCase.GetNotificationSettingsUseCase,
    private readonly updateNotificationSettingsUseCase: NotificationUseCase.UpdateNotificationSettingsUseCase,
    private readonly setQuietHoursUseCase: NotificationUseCase.SetQuietHoursUseCase,
    private readonly manageMarketingOptInUseCase: NotificationUseCase.ManageMarketingOptInUseCase,
    private readonly configureEmailNotificationsByCategoryUseCase: NotificationUseCase.ConfigureEmailNotificationsByCategoryUseCase,
    private readonly configurePushNotificationsByCategoryUseCase: NotificationUseCase.ConfigurePushNotificationsByCategoryUseCase,
    private readonly configureSmsAlertsUseCase: NotificationUseCase.ConfigureSmsAlertsUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get notification settings' })
  async getNotificationSettings(
    @CurrentUser('sub') userId: string,
  ): Promise<NotificationDto.NotificationSettingsResponseDto> {
    return this.getNotificationSettingsUseCase.execute(userId);
  }

  @Put()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update notification settings' })
  async updateNotificationSettings(
    @CurrentUser('sub') userId: string,
    @Body() dto: NotificationDto.UpdateNotificationSettingsDto,
  ): Promise<NotificationDto.NotificationSettingsResponseDto> {
    return this.updateNotificationSettingsUseCase.execute(userId, dto);
  }

  @Put('quiet-hours')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Set quiet hours' })
  async setQuietHours(
    @CurrentUser('sub') userId: string,
    @Body() dto: NotificationDto.SetQuietHoursDto,
  ): Promise<NotificationDto.QuietHoursResponseDto> {
    return this.setQuietHoursUseCase.execute(userId, dto);
  }

  @Put('marketing-opt-in')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Manage marketing opt-in preferences' })
  async manageMarketingOptIn(
    @CurrentUser('sub') userId: string,
    @Body() dto: NotificationDto.ManageMarketingOptInDto,
  ): Promise<NotificationDto.MarketingOptInResponseDto> {
    return this.manageMarketingOptInUseCase.execute(userId, dto);
  }

  @Put('email-by-category')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Configure email notifications by category' })
  async configureEmailNotificationsByCategory(
    @CurrentUser('sub') userId: string,
    @Body() dto: NotificationDto.ConfigureEmailNotificationsDto,
  ): Promise<NotificationDto.EmailNotificationCategoriesResponseDto> {
    return this.configureEmailNotificationsByCategoryUseCase.execute(userId, dto);
  }

  @Put('push-by-category')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Configure push notifications by category' })
  async configurePushNotificationsByCategory(
    @CurrentUser('sub') userId: string,
    @Body() dto: NotificationDto.ConfigurePushNotificationsDto,
  ): Promise<NotificationDto.PushNotificationCategoriesResponseDto> {
    return this.configurePushNotificationsByCategoryUseCase.execute(userId, dto);
  }

  @Put('sms-alerts')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Configure SMS alerts' })
  async configureSmsAlerts(
    @CurrentUser('sub') userId: string,
    @Body() dto: NotificationDto.ConfigureSmsAlertsDto,
  ): Promise<NotificationDto.SmsAlertsResponseDto> {
    return this.configureSmsAlertsUseCase.execute(userId, dto);
  }
}
