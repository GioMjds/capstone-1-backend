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
} from '@nestjs/common';
import * as UserUseCase from '@/application/use-cases/identity/user';

@Controller('users')
export class UsersController {
  constructor(
    private readonly createUserUseCase: UserUseCase.CreateUserUseCase,
    private readonly getUserUseCase: UserUseCase.GetUserUseCase,
    private readonly updateUserUseCase: UserUseCase.UpdateUserUseCase,
    private readonly archiveUserUseCase: UserUseCase.ArchiveUserUseCase,
    private readonly getUserByIdUseCase: UserUseCase.GetUserByIdUseCase,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getUser() {
    return await this.getUserUseCase.execute();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getUserById(@Param('id') id: string) {
    return await this.getUserByIdUseCase.execute();
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createUser() {
    return await this.createUserUseCase.execute();
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async updateUser(@Param('id') id: string, @Body() body: any) {
    return await this.updateUserUseCase.execute();
  }

  @Patch(':id/archive')
  @HttpCode(HttpStatus.OK)
  async archiveUser(@Param('id') id: string) {
    return await this.archiveUserUseCase.execute();
  }
}
