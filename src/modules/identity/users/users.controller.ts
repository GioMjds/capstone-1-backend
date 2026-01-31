import {
  Controller,
  Post,
  Get,
  Param,
  Patch,
  Body,
  HttpCode,
  HttpStatus,
  Put,
  UseGuards,
} from '@nestjs/common';
import * as UserUseCase from '@/application/use-cases/identity/user';
import * as UserDto from '@/application/dto/user';
import { JwtAuthGuard } from '@/shared/guards';

@Controller('users')
export class UsersController {
  constructor(
    private readonly createUserUseCase: UserUseCase.CreateUserUseCase,
    private readonly getUsersUseCase: UserUseCase.GetUsersUseCase,
    private readonly updateUserUseCase: UserUseCase.UpdateUserUseCase,
    private readonly archiveUserUseCase: UserUseCase.ArchiveUserUseCase,
    private readonly getUserByIdUseCase: UserUseCase.GetUserByIdUseCase,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async getUsers() {
    return await this.getUsersUseCase.execute();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async getUserById(@Param('id') dto: UserDto.GetUserByIdDto) {
    return await this.getUserByIdUseCase.execute(dto);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async createUser(@Body() dto: UserDto.CreateUserDto) {
    return await this.createUserUseCase.execute(dto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async updateUser(
    @Param('id') id: string,
    @Body() dto: UserDto.UpdateUserDto,
  ) {
    return await this.updateUserUseCase.execute(id, dto);
  }

  @Patch(':id/archive')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async archiveUser(@Param('id') dto: UserDto.ArchiveUserDto) {
    return await this.archiveUserUseCase.execute(dto);
  }
}
