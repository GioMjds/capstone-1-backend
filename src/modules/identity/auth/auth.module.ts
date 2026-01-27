import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { getJwtConfig } from '@/infrastructure/config';
import { JwtModule } from '@nestjs/jwt';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { OAuth, OtpService, Token } from '@/shared/utils';
import { EmailModule } from '@/modules/email/email.module';
import { EmailListener } from '@/modules/email/listeners/email.listener';
import { PrismaService, RedisService } from '@/infrastructure/persistence';
import { PrismaUserRepository } from '../users';

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
    PrismaService,
    RedisService,
    OAuth,
    OtpService,
    Token,
    EmailListener,
    {
      provide: 'IUserRepository',
      useClass: PrismaUserRepository,
    }
  ],
  exports: [AuthService, JwtModule, OAuth, 'IUserRepository'],
})
export class AuthModule {}
