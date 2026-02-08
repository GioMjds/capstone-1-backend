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
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import * as AccountControlsUseCase from '@/application/use-cases/identity/preferences/account-controls';
import * as AccountControlsDto from '@/application/dto/identity/preferences/account-controls';
import { JwtAuthGuard } from '@/shared/guards';
import { CurrentUser, JwtPayload } from '@/shared/decorators';

@ApiTags('Preferences - Account Controls')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('preferences/account-controls')
export class AccountControlsController {
  constructor(
    private readonly changeEmailUseCase: AccountControlsUseCase.ChangeEmailUseCase,
    private readonly changeUsernameUseCase: AccountControlsUseCase.ChangeUsernameUseCase,
    private readonly logoutAllDevicesUseCase: AccountControlsUseCase.LogoutAllDevicesUseCase,
    private readonly manageRecoveryOptionsUseCase: AccountControlsUseCase.ManageRecoveryOptionsUseCase,
    private readonly accountDeactivationUseCase: AccountControlsUseCase.AccountDeactivationUseCase,
    private readonly accountDeletionUseCase: AccountControlsUseCase.AccountDeletionUseCase,
    private readonly accountRecoveryUseCase: AccountControlsUseCase.AccountRecoveryUseCase,
    private readonly getUiPreferencesUseCase: AccountControlsUseCase.GetUiPreferencesUseCase,
    private readonly updateUiPreferencesUseCase: AccountControlsUseCase.UpdateUiPreferencesUseCase,
  ) {}

  @Put('email')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Change account email' })
  async changeEmail(
    @Body() dto: AccountControlsDto.ChangeEmailDto,
  ): Promise<AccountControlsDto.ChangeEmailResponseDto> {
    return this.changeEmailUseCase.execute(dto);
  }

  @Put('username')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Change username' })
  async changeUsername(
    @Body() dto: AccountControlsDto.ChangeUsernameDto,
  ): Promise<AccountControlsDto.ChangeUsernameResponseDto> {
    return this.changeUsernameUseCase.execute(dto);
  }

  @Post('logout-all-devices')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Logout from all devices' })
  async logoutAllDevices(): Promise<AccountControlsDto.LogoutAllDevicesResponseDto> {
    return this.logoutAllDevicesUseCase.execute();
  }

  @Put('recovery-options')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Manage account recovery options' })
  async manageRecoveryOptions(
    @CurrentUser() userId: JwtPayload,
    @Body() dto: AccountControlsDto.ManageRecoveryOptionsDto,
  ): Promise<AccountControlsDto.ManageRecoveryOptionsResponseDto> {
    return this.manageRecoveryOptionsUseCase.execute(userId.sub, dto);
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
  ): Promise<AccountControlsDto.UiPreferencesResponseDto> {
    return this.getUiPreferencesUseCase.execute(userId);
  }

  @Put('ui-preferences/:userId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update UI preferences' })
  async updateUiPreferences(
    @Param('userId') userId: string,
    @Body() dto: AccountControlsDto.UpdateUiPreferencesDto,
  ) {
    return this.updateUiPreferencesUseCase.execute(userId, dto);
  }
}
