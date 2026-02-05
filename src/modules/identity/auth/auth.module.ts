import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { getJwtConfig } from '@/infrastructure/config';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { OAuth, OtpService, Token } from '@/shared/utils';
import { EmailModule } from '@/shared/email';
import { EmailListener } from '@/shared/email/listeners';
import {
  PrismaService,
  RedisService,
  JwtTokenService,
} from '@/infrastructure/persistence';
import { PrismaUserRepository } from '@/infrastructure/persistence/prisma/repositories';
import { PrismaUserPreferencesRepository } from '@/infrastructure/persistence/prisma/repositories/identity/preferences';
import { PreferencesMapper } from '@/infrastructure/persistence/prisma/mappers/identity/preferences';
import { AUTH_USE_CASES } from '@/application/use-cases/identity/auth';
import { UserMapper } from '@/infrastructure/persistence/prisma/mappers';
import { UserCreatedListener } from './listeners';

@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getJwtConfig,
    }),
    HttpModule,
    EmailModule,
  ],
  controllers: [AuthController],
  providers: [
    ...AUTH_USE_CASES,
    PrismaService,
    RedisService,
    OAuth,
    OtpService,
    Token,
    EmailListener,
    UserCreatedListener,
    PreferencesMapper,
    {
      provide: 'IUserRepository',
      useClass: PrismaUserRepository,
    },
    {
      provide: 'ITokenService',
      useClass: JwtTokenService,
    },
    {
      provide: 'IUserPreferencesRepository',
      useClass: PrismaUserPreferencesRepository,
    },
    UserMapper,
  ],
  exports: [],
})
export class AuthModule {}
