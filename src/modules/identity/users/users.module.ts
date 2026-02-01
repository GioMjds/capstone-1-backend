import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersController } from './users.controller';
import { PrismaService } from '@/infrastructure/persistence';
import { PrismaUserRepository } from '@/infrastructure/persistence/prisma/repositories';
import { UserMapper } from '@/infrastructure/persistence/prisma/mappers';
import { USER_USE_CASES } from '@/application/use-cases/identity/user';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [ConfigModule],
  controllers: [UsersController],
  providers: [
    JwtService,
    ...USER_USE_CASES,
    PrismaService,
    {
      provide: 'IUserRepository',
      useClass: PrismaUserRepository,
    },
    UserMapper,
  ],
  exports: [
    JwtService,
    ...USER_USE_CASES,
    {
      provide: 'IUserRepository',
      useClass: PrismaUserRepository,
    },
    UserMapper,
    PrismaService,
  ],
})
export class UsersModule {}
