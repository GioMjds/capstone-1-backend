import {
  Controller,
  Put,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import * as CustomizationsUseCase from '@/application/use-cases/identity/preferences/customizations';
import * as CustomizationsDto from '@/application/dto/identity/preferences/customizations';
import { JwtAuthGuard } from '@/shared/guards';
import { CurrentUser } from '@/shared/decorators';

@ApiTags('Preferences - Customizations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('preferences/customizations')
export class CustomizationsController {
  constructor(
    private readonly setThemeUseCase: CustomizationsUseCase.SetThemeUseCase,
    private readonly setLayoutPreferencesUseCase: CustomizationsUseCase.SetLayoutPreferencesUseCase,
    private readonly setDefaultViewsUseCase: CustomizationsUseCase.SetDefaultViewsUseCase,
    private readonly setSortFilterDefaultsUseCase: CustomizationsUseCase.SetSortFilterDefaultsUseCase,
    private readonly setPaginationSizeUseCase: CustomizationsUseCase.SetPaginationSizeUseCase,
    private readonly manageFeatureTogglesUseCase: CustomizationsUseCase.ManageFeatureTogglesUseCase,
    private readonly manageBetaFeaturesOptInUseCase: CustomizationsUseCase.ManageBetaFeaturesOptInUseCase,
    private readonly manageAiFeaturesOptInUseCase: CustomizationsUseCase.ManageAiFeaturesOptInUseCase,
    private readonly setContentSensitivityFiltersUseCase: CustomizationsUseCase.SetContentSensitivityFiltersUseCase,
  ) {}

  @Put('theme')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Set theme preference' })
  async setTheme(
    @CurrentUser('sub') userId: string,
    @Body() dto: CustomizationsDto.SetThemeDto,
  ): Promise<CustomizationsDto.ThemeResponseDto> {
    return this.setThemeUseCase.execute(userId, dto);
  }

  @Put('layout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Set layout preferences' })
  async setLayoutPreferences(
    @CurrentUser('sub') userId: string,
    @Body() dto: CustomizationsDto.SetLayoutPreferencesDto,
  ): Promise<CustomizationsDto.LayoutPreferencesResponseDto> {
    return this.setLayoutPreferencesUseCase.execute(userId, dto);
  }

  @Put('default-views')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Set default views' })
  async setDefaultViews(
    @CurrentUser('sub') userId: string,
    @Body() dto: CustomizationsDto.SetDefaultViewsDto,
  ): Promise<CustomizationsDto.DefaultViewsResponseDto> {
    return this.setDefaultViewsUseCase.execute(userId, dto);
  }

  @Put('sort-filter-defaults')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Set sort and filter defaults' })
  async setSortFilterDefaults(
    @CurrentUser('sub') userId: string,
    @Body() dto: CustomizationsDto.SetSortFilterDefaultsDto,
  ): Promise<CustomizationsDto.SortFilterDefaultsResponseDto> {
    return this.setSortFilterDefaultsUseCase.execute(userId, dto);
  }

  @Put('pagination-size')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Set pagination size' })
  async setPaginationSize(
    @CurrentUser('sub') userId: string,
    @Body() dto: CustomizationsDto.SetPaginationSizeDto,
  ): Promise<CustomizationsDto.PaginationSizeResponseDto> {
    return this.setPaginationSizeUseCase.execute(userId, dto);
  }

  @Put('feature-toggles')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Manage feature toggles' })
  async manageFeatureToggles(
    @CurrentUser('sub') userId: string,
    @Body() dto: CustomizationsDto.ManageFeatureTogglesDto,
  ): Promise<CustomizationsDto.ManageFeatureTogglesResponseDto> {
    return this.manageFeatureTogglesUseCase.execute(userId, dto);
  }

  @Put('beta-features')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Opt in/out of beta features' })
  async manageBetaFeaturesOptIn(
    @CurrentUser('sub') userId: string,
    @Body() dto: CustomizationsDto.ManageBetaFeaturesDto,
  ): Promise<CustomizationsDto.BetaFeaturesResponseDto> {
    return this.manageBetaFeaturesOptInUseCase.execute(userId, dto);
  }

  @Put('ai-features')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Opt in/out of AI features' })
  async manageAiFeaturesOptIn(
    @CurrentUser('sub') userId: string,
    @Body() dto: CustomizationsDto.ManageAiFeaturesOptInDto,
  ): Promise<CustomizationsDto.ManageAiFeaturesOptInResponseDto> {
    return this.manageAiFeaturesOptInUseCase.execute(userId, dto);
  }

  @Put('content-sensitivity-filters')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Set content sensitivity filters' })
  async setContentSensitivityFilters(
    @CurrentUser('sub') userId: string,
    @Body() dto: CustomizationsDto.SetContentSensitivityFiltersDto,
  ): Promise<CustomizationsDto.ContentSensitivityFiltersResponseDto> {
    return this.setContentSensitivityFiltersUseCase.execute(userId, dto);
  }
}
