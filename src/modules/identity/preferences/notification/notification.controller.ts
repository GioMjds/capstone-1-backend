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
    @Body() dto: NotificationDto.SetQuietHoursDto,
  ): Promise<NotificationDto.SetQuietHoursResponseDto> {
    return this.setQuietHoursUseCase.execute(dto);
  }

  @Put('marketing-opt-in')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Manage marketing opt-in preferences' })
  async manageMarketingOptIn(
    @Body() dto: NotificationDto.ManageMarketingOptInDto,
  ): Promise<NotificationDto.ManageMarketingOptInResponseDto> {
    return this.manageMarketingOptInUseCase.execute(dto);
  }

  @Put('email-by-category')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Configure email notifications by category' })
  async configureEmailNotificationsByCategory(
    @Body() dto: NotificationDto.ConfigureEmailNotificationsByCategoryDto,
  ): Promise<NotificationDto.ConfigureEmailNotificationsByCategoryResponseDto> {
    return this.configureEmailNotificationsByCategoryUseCase.execute(dto);
  }

  @Put('push-by-category')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Configure push notifications by category' })
  async configurePushNotificationsByCategory(
    @Body() dto: NotificationDto.ConfigurePushNotificationsByCategoryDto,
  ): Promise<NotificationDto.ConfigurePushNotificationsByCategoryResponseDto> {
    return this.configurePushNotificationsByCategoryUseCase.execute(dto);
  }

  @Put('sms-alerts')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Configure SMS alerts' })
  async configureSmsAlerts(
    @Body() dto: NotificationDto.ConfigureSmsAlertsDto,
  ): Promise<NotificationDto.ConfigureSmsAlertsResponseDto> {
    return this.configureSmsAlertsUseCase.execute(dto);
  }
}
