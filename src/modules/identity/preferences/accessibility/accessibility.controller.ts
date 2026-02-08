import {
  Controller,
  Put,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import * as AccessibilityUseCase from '@/application/use-cases/identity/preferences/accessibility';
import * as AccessibilityDto from '@/application/dto/identity/preferences/accessibility';
import { JwtAuthGuard } from '@/shared/guards';
import { CurrentUser } from '@/shared/decorators';

@ApiTags('Preferences - Accessibility')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('preferences/accessibility')
export class AccessibilityController {
  constructor(
    private readonly setLanguageUseCase: AccessibilityUseCase.SetLanguageUseCase,
    private readonly setTimezoneUseCase: AccessibilityUseCase.SetTimezoneUseCase,
    private readonly setDateNumberFormatsUseCase: AccessibilityUseCase.SetDateNumberFormatsUseCase,
    private readonly setCurrencyUseCase: AccessibilityUseCase.SetCurrencyUseCase,
    private readonly setTimeFormatUseCase: AccessibilityUseCase.SetTimeFormatUseCase,
    private readonly setAccessibilityPreferencesUseCase: AccessibilityUseCase.SetAccessibilityPreferencesUseCase,
    private readonly setHighContrastModeUseCase: AccessibilityUseCase.SetHighContrastModeUseCase,
  ) {}

  @Put('language')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Set preferred language' })
  async setLanguage(
    @CurrentUser('sub') userId: string,
    @Body() dto: AccessibilityDto.SetLanguageDto,
  ): Promise<AccessibilityDto.SetLanguageResponseDto> {
    return this.setLanguageUseCase.execute(userId, dto);
  }

  @Put('timezone')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Set timezone' })
  async setTimezone(
    @CurrentUser('sub') userId: string,
    @Body() dto: AccessibilityDto.SetTimezoneDto,
  ): Promise<AccessibilityDto.SetTimezoneResponseDto> {
    return this.setTimezoneUseCase.execute(userId, dto);
  }

  @Put('date-number-formats')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Set date and number format preferences' })
  async setDateNumberFormats(
    @CurrentUser('sub') userId: string,
    @Body() dto: AccessibilityDto.SetDateNumberFormatsDto,
  ): Promise<AccessibilityDto.SetDateNumberFormatsResponseDto> {
    return this.setDateNumberFormatsUseCase.execute(userId, dto);
  }

  @Put('currency')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Set preferred currency' })
  async setCurrency(
    @CurrentUser('sub') userId: string,
    @Body() dto: AccessibilityDto.SetCurrencyDto,
  ): Promise<AccessibilityDto.SetCurrencyResponseDto> {
    return this.setCurrencyUseCase.execute(userId, dto);
  }

  @Put('time-format')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Set time format (12h/24h)' })
  async setTimeFormat(
    @CurrentUser('sub') userId: string,
    @Body() dto: AccessibilityDto.SetTimeFormatDto,
  ): Promise<AccessibilityDto.SetTimeFormatResponseDto> {
    return this.setTimeFormatUseCase.execute(userId, dto);
  }

  @Put('preferences')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Set accessibility preferences' })
  async setAccessibilityPreferences(
    @CurrentUser('sub') userId: string,
    @Body() dto: AccessibilityDto.SetAccessibilityPreferencesDto,
  ): Promise<AccessibilityDto.SetAccessibilityPreferencesResponseDto> {
    return this.setAccessibilityPreferencesUseCase.execute(userId, dto);
  }

  @Put('high-contrast')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Toggle high contrast mode' })
  async setHighContrastMode(
    @CurrentUser('sub') userId: string,
    @Body() dto: AccessibilityDto.SetHighContrastModeDto,
  ): Promise<AccessibilityDto.SetHighContrastModeResponseDto> {
    return this.setHighContrastModeUseCase.execute(userId, dto);
  }
}
