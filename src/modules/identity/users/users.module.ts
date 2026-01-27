import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { HttpModule } from '@nestjs/axios';
import { EmailModule } from '@/modules/email/email.module';
import { PrismaService } from '@/infrastructure/persistence';
import { PrismaUserRepository } from './user.prisma.repository';

@Module({
  imports: [HttpModule, EmailModule],
  controllers: [UsersController],
  providers: [UsersService, PrismaService, PrismaUserRepository],
  exports: [PrismaUserRepository],
})
export class UsersModule {}
