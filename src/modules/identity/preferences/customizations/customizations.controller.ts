import { Controller, Put, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import {
  SetThemeUseCase,
  SetLayoutPreferencesUseCase,
  SetDefaultViewsUseCase,
  SetSortFilterDefaultsUseCase,
  SetPaginationSizeUseCase,
  ManageFeatureTogglesUseCase,
  ManageBetaFeaturesOptInUseCase,
  ManageAiFeaturesOptInUseCase,
  SetContentSensitivityFiltersUseCase,
} from '@/application/use-cases/identity/preferences';
import {
  SetThemeDto,
  SetThemeResponseDto,
  SetLayoutPreferencesDto,
  SetLayoutPreferencesResponseDto,
  SetDefaultViewsDto,
  SetDefaultViewsResponseDto,
  SetSortFilterDefaultsDto,
  SetSortFilterDefaultsResponseDto,
  SetPaginationSizeDto,
  SetPaginationSizeResponseDto,
  ManageFeatureTogglesDto,
  ManageFeatureTogglesResponseDto,
  ManageBetaFeaturesOptInDto,
  ManageBetaFeaturesOptInResponseDto,
  ManageAiFeaturesOptInDto,
  ManageAiFeaturesOptInResponseDto,
  SetContentSensitivityFiltersDto,
  SetContentSensitivityFiltersResponseDto,
} from '@/application/dto/identity/preferences';

@ApiTags('Preferences - Customizations')
@ApiBearerAuth()
@Controller('preferences/customizations')
export class CustomizationsController {
  constructor(
    private readonly setThemeUseCase: SetThemeUseCase,
    private readonly setLayoutPreferencesUseCase: SetLayoutPreferencesUseCase,
    private readonly setDefaultViewsUseCase: SetDefaultViewsUseCase,
    private readonly setSortFilterDefaultsUseCase: SetSortFilterDefaultsUseCase,
    private readonly setPaginationSizeUseCase: SetPaginationSizeUseCase,
    private readonly manageFeatureTogglesUseCase: ManageFeatureTogglesUseCase,
    private readonly manageBetaFeaturesOptInUseCase: ManageBetaFeaturesOptInUseCase,
    private readonly manageAiFeaturesOptInUseCase: ManageAiFeaturesOptInUseCase,
    private readonly setContentSensitivityFiltersUseCase: SetContentSensitivityFiltersUseCase,
  ) {}

  @Put('theme')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Set theme preference' })
  async setTheme(@Body() dto: SetThemeDto): Promise<SetThemeResponseDto> {
    return this.setThemeUseCase.execute(dto);
  }

  @Put('layout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Set layout preferences' })
  async setLayoutPreferences(
    @Body() dto: SetLayoutPreferencesDto,
  ): Promise<SetLayoutPreferencesResponseDto> {
    return this.setLayoutPreferencesUseCase.execute(dto);
  }

  @Put('default-views')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Set default views' })
  async setDefaultViews(
    @Body() dto: SetDefaultViewsDto,
  ): Promise<SetDefaultViewsResponseDto> {
    return this.setDefaultViewsUseCase.execute(dto);
  }

  @Put('sort-filter-defaults')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Set sort and filter defaults' })
  async setSortFilterDefaults(
    @Body() dto: SetSortFilterDefaultsDto,
  ): Promise<SetSortFilterDefaultsResponseDto> {
    return this.setSortFilterDefaultsUseCase.execute(dto);
  }

  @Put('pagination-size')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Set pagination size' })
  async setPaginationSize(
    @Body() dto: SetPaginationSizeDto,
  ): Promise<SetPaginationSizeResponseDto> {
    return this.setPaginationSizeUseCase.execute(dto);
  }

  @Put('feature-toggles')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Manage feature toggles' })
  async manageFeatureToggles(
    @Body() dto: ManageFeatureTogglesDto,
  ): Promise<ManageFeatureTogglesResponseDto> {
    return this.manageFeatureTogglesUseCase.execute(dto);
  }

  @Put('beta-features')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Opt in/out of beta features' })
  async manageBetaFeaturesOptIn(
    @Body() dto: ManageBetaFeaturesOptInDto,
  ): Promise<ManageBetaFeaturesOptInResponseDto> {
    return this.manageBetaFeaturesOptInUseCase.execute(dto);
  }

  @Put('ai-features')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Opt in/out of AI features' })
  async manageAiFeaturesOptIn(
    @Body() dto: ManageAiFeaturesOptInDto,
  ): Promise<ManageAiFeaturesOptInResponseDto> {
    return this.manageAiFeaturesOptInUseCase.execute(dto);
  }

  @Put('content-sensitivity-filters')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Set content sensitivity filters' })
  async setContentSensitivityFilters(
    @Body() dto: SetContentSensitivityFiltersDto,
  ): Promise<SetContentSensitivityFiltersResponseDto> {
    return this.setContentSensitivityFiltersUseCase.execute(dto);
  }
}
