import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EmailService } from './email.service';
import { EmailListener } from './listeners';

@Module({
  imports: [ConfigModule],
  providers: [EmailService, EmailListener],
  exports: [EmailService],
})
export class EmailModule {}
