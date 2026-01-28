import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { getJwtConfig } from '@/infrastructure/config';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { OAuth, OtpService, Token } from '@/shared/utils';
import { EmailModule } from '@/shared/email/email.module';
import { EmailListener } from '@/shared/email/listeners/email.listener';
import { PrismaService, RedisService } from '@/infrastructure/persistence';
import { PrismaUserRepository } from '@/infrastructure/persistence/prisma/repositories';
import { LoginUseCase } from '@/application/use-cases/identity/auth';
import { RegisterUserUseCase } from '@/application/use-cases/identity/auth/register.use-case';
import { JwtTokenService } from '@/infrastructure/persistence/jwt.service';
import { HttpModule } from '@nestjs/axios';

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
    LoginUseCase,
    RegisterUserUseCase,
    PrismaService,
    RedisService,
    OAuth,
    OtpService,
    Token,
    EmailListener,
    LoginUseCase,
    {
      provide: 'IUserRepository',
      useClass: PrismaUserRepository,
    },
    {
      provide: 'ITokenService',
      useClass: JwtTokenService,
    }
  ],
  exports: [AuthService],
})
export class AuthModule {}
