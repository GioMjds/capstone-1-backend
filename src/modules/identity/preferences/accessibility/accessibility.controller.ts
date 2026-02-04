import { Controller, Get, Put, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import {
  SetLanguageUseCase,
  SetTimezoneUseCase,
  SetDateNumberFormatsUseCase,
  SetCurrencyUseCase,
  SetTimeFormatUseCase,
  SetAccessibilityPreferencesUseCase,
  SetHighContrastModeUseCase,
} from '@/application/use-cases/identity/preferences';
import {
  SetLanguageDto,
  SetLanguageResponseDto,
  SetTimezoneDto,
  SetTimezoneResponseDto,
  SetDateNumberFormatsDto,
  SetDateNumberFormatsResponseDto,
  SetCurrencyDto,
  SetCurrencyResponseDto,
  SetTimeFormatDto,
  SetTimeFormatResponseDto,
  SetAccessibilityPreferencesDto,
  SetAccessibilityPreferencesResponseDto,
  SetHighContrastModeDto,
  SetHighContrastModeResponseDto,
} from '@/application/dto/identity/preferences';

@ApiTags('Preferences - Accessibility')
@ApiBearerAuth()
@Controller('preferences/accessibility')
export class AccessibilityController {
  constructor(
    private readonly setLanguageUseCase: SetLanguageUseCase,
    private readonly setTimezoneUseCase: SetTimezoneUseCase,
    private readonly setDateNumberFormatsUseCase: SetDateNumberFormatsUseCase,
    private readonly setCurrencyUseCase: SetCurrencyUseCase,
    private readonly setTimeFormatUseCase: SetTimeFormatUseCase,
    private readonly setAccessibilityPreferencesUseCase: SetAccessibilityPreferencesUseCase,
    private readonly setHighContrastModeUseCase: SetHighContrastModeUseCase,
  ) {}

  @Put('language')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Set preferred language' })
  async setLanguage(@Body() dto: SetLanguageDto): Promise<SetLanguageResponseDto> {
    return this.setLanguageUseCase.execute(dto);
  }

  @Put('timezone')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Set timezone' })
  async setTimezone(@Body() dto: SetTimezoneDto): Promise<SetTimezoneResponseDto> {
    return this.setTimezoneUseCase.execute(dto);
  }

  @Put('date-number-formats')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Set date and number format preferences' })
  async setDateNumberFormats(
    @Body() dto: SetDateNumberFormatsDto,
  ): Promise<SetDateNumberFormatsResponseDto> {
    return this.setDateNumberFormatsUseCase.execute(dto);
  }

  @Put('currency')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Set preferred currency' })
  async setCurrency(@Body() dto: SetCurrencyDto): Promise<SetCurrencyResponseDto> {
    return this.setCurrencyUseCase.execute(dto);
  }

  @Put('time-format')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Set time format (12h/24h)' })
  async setTimeFormat(@Body() dto: SetTimeFormatDto): Promise<SetTimeFormatResponseDto> {
    return this.setTimeFormatUseCase.execute(dto);
  }

  @Put('preferences')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Set accessibility preferences' })
  async setAccessibilityPreferences(
    @Body() dto: SetAccessibilityPreferencesDto,
  ): Promise<SetAccessibilityPreferencesResponseDto> {
    return this.setAccessibilityPreferencesUseCase.execute(dto);
  }

  @Put('high-contrast')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Toggle high contrast mode' })
  async setHighContrastMode(
    @Body() dto: SetHighContrastModeDto,
  ): Promise<SetHighContrastModeResponseDto> {
    return this.setHighContrastModeUseCase.execute(dto);
  }
}
