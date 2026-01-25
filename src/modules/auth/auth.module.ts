import { Module } from '@nestjs/common';
import { AuthService, AuthController } from './index';
import { getJwtConfig, PrismaService, RedisService } from '@/configs';
import { JwtModule } from '@nestjs/jwt';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { OAuth, OtpService, Token } from '@/shared/utils';
import { EmailModule } from '../email';
import { EmailListener } from '../email/listeners';

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
  ],
  exports: [AuthService, JwtModule, OAuth],
})
export class AuthModule {}
