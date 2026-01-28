import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
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
import { AUTH_USE_CASES } from '@/application/use-cases/identity/auth';

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
    AuthService,
    ...AUTH_USE_CASES,
    PrismaService,
    RedisService,
    OAuth,
    OtpService,
    Token,
    EmailListener,
    {
      provide: 'IUserRepository',
      useClass: PrismaUserRepository,
    },
    {
      provide: 'ITokenService',
      useClass: JwtTokenService,
    },
  ],
  exports: [AuthService],
})
export class AuthModule {}
