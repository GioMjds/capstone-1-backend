import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { PrismaService } from '@/infrastructure/persistence';
import { PrismaUserRepository } from '@/infrastructure/persistence/prisma/repositories';

@Module({
  imports: [],
  controllers: [UsersController],
  providers: [PrismaService, PrismaUserRepository],
  exports: [PrismaUserRepository],
})
export class UsersModule {}
