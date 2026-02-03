import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserPreferencesController } from './preferences.controller';
import { UserMapper } from '@/infrastructure/persistence/prisma/mappers';
import { PrismaService } from '@/infrastructure/persistence';
import { USER_PREFERENCES_USE_CASES } from '@/application/use-cases/identity/preferences';

@Module({
  imports: [ConfigModule],
  controllers: [UserPreferencesController],
  providers: [
    JwtService,
    UserMapper,
    PrismaService,
    ...USER_PREFERENCES_USE_CASES,
    {
      provide: 'IUserRepository',
      useClass: PrismaService,
    },
  ],
  exports: [
    JwtService,
    UserMapper,
    PrismaService,
    ...USER_PREFERENCES_USE_CASES,
  ],
})
export class PreferencesModule {}
