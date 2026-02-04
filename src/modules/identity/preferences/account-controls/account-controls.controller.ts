import {
  Controller,
  Get,
  Put,
  Post,
  Delete,
  Body,
  HttpCode,
  HttpStatus,
  Param,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import {
  ChangeEmailUseCase,
  ChangeUsernameUseCase,
  LogoutAllDevicesUseCase,
  ManageRecoveryOptionsUseCase,
  AccountDeactivationUseCase,
  AccountDeletionUseCase,
  AccountRecoveryUseCase,
  GetUiPreferencesUseCase,
  UpdateUiPreferencesUseCase,
} from '@/application/use-cases/identity/preferences';
import {
  ChangeEmailDto,
  ChangeEmailResponseDto,
  ChangeUsernameDto,
  ChangeUsernameResponseDto,
  LogoutAllDevicesResponseDto,
  ManageRecoveryOptionsDto,
  ManageRecoveryOptionsResponseDto,
  UpdateUiPreferencesDto,
  UiPreferencesResponseDto,
} from '@/application/dto/identity/preferences';

@ApiTags('Preferences - Account Controls')
@ApiBearerAuth()
@Controller('preferences/account-controls')
export class AccountControlsController {
  constructor(
    private readonly changeEmailUseCase: ChangeEmailUseCase,
    private readonly changeUsernameUseCase: ChangeUsernameUseCase,
    private readonly logoutAllDevicesUseCase: LogoutAllDevicesUseCase,
    private readonly manageRecoveryOptionsUseCase: ManageRecoveryOptionsUseCase,
    private readonly accountDeactivationUseCase: AccountDeactivationUseCase,
    private readonly accountDeletionUseCase: AccountDeletionUseCase,
    private readonly accountRecoveryUseCase: AccountRecoveryUseCase,
    private readonly getUiPreferencesUseCase: GetUiPreferencesUseCase,
    private readonly updateUiPreferencesUseCase: UpdateUiPreferencesUseCase,
  ) {}

  @Put('email')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Change account email' })
  async changeEmail(@Body() dto: ChangeEmailDto): Promise<ChangeEmailResponseDto> {
    return this.changeEmailUseCase.execute(dto);
  }

  @Put('username')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Change username' })
  async changeUsername(@Body() dto: ChangeUsernameDto): Promise<ChangeUsernameResponseDto> {
    return this.changeUsernameUseCase.execute(dto);
  }

  @Post('logout-all-devices')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Logout from all devices' })
  async logoutAllDevices(): Promise<LogoutAllDevicesResponseDto> {
    return this.logoutAllDevicesUseCase.execute();
  }

  @Put('recovery-options')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Manage account recovery options' })
  async manageRecoveryOptions(
    @Body() dto: ManageRecoveryOptionsDto,
  ): Promise<ManageRecoveryOptionsResponseDto> {
    return this.manageRecoveryOptionsUseCase.execute(dto);
  }

  @Post('deactivate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Deactivate account' })
  async deactivateAccount(): Promise<void> {
    return this.accountDeactivationUseCase.execute();
  }

  @Delete('delete')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Request account deletion' })
  async deleteAccount(): Promise<void> {
    return this.accountDeletionUseCase.execute();
  }

  @Post('recover')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Recover deactivated account' })
  async recoverAccount(): Promise<void> {
    return this.accountRecoveryUseCase.execute();
  }

  @Get('ui-preferences/:userId')
  @ApiOperation({ summary: 'Get UI preferences' })
  async getUiPreferences(
    @Param('userId') userId: string,
  ): Promise<UiPreferencesResponseDto> {
    return this.getUiPreferencesUseCase.execute(userId);
  }

  @Put('ui-preferences/:userId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update UI preferences' })
  async updateUiPreferences(
    @Param('userId') userId: string,
    @Body() dto: UpdateUiPreferencesDto,
  ) {
    return this.updateUiPreferencesUseCase.execute(userId, dto);
  }
}
