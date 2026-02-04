import { Module } from '@nestjs/common';
import { AccountControlsController } from './account-controls.controller';

@Module({
  controllers: [AccountControlsController]
})
export class AccountControlsModule {}
