import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { getJwtConfig, PrismaService, RedisService } from 'src/configs';
import { JwtModule } from '@nestjs/jwt';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { OAuth, OtpService, Token } from '@/shared/utils';
import { EmailModule } from '../email';

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
  ],
  exports: [AuthService, JwtModule, OAuth],
})
export class AuthModule {}
