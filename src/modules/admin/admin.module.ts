import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { UsersModule } from '../identity';

@Module({
  imports: [UsersModule],
  controllers: [AdminController],
})
export class AdminModule {}
