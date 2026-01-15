import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { getJwtConfig, PrismaService } from 'src/configs';
import { JwtModule } from '@nestjs/jwt';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { OAuth } from '@/shared/utils/oauth';
import { Token } from '@/shared/utils/token';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getJwtConfig,
    }),
    HttpModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, PrismaService, OAuth, Token],
  exports: [AuthService, JwtModule, OAuth],
})
export class AuthModule {}
