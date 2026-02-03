import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import * as UserUseCase from '@/application/use-cases/identity/user';
import * as UsersDto from '@/application/dto/identity/user';
import { JwtAuthGuard } from '@/shared/guards';

@Controller('admin')
export class AdminController {
  constructor(
    private readonly getAllUsersUseCase: UserUseCase.GetUsersUseCase,
    private readonly updateUserUseCase: UserUseCase.UpdateUserUseCase,
    private readonly getUserUseCase: UserUseCase.GetUserByIdUseCase,
  ) {}

  @Get('users')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async getAllUsers() {
    return this.getAllUsersUseCase.execute();
  }

  @Get('users/:id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async getUser(@Param('id') id: string) {
    return this.getUserUseCase.execute({ id });
  }

  @Put('users/:id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async updateUser(
    @Param('id') id: string,
    @Body() dto: UsersDto.UpdateUserDto,
  ) {
    return this.updateUserUseCase.execute(id, dto);
  }
}
