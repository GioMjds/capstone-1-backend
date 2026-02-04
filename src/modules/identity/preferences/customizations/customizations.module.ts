import { Module } from '@nestjs/common';
import { CustomizationsController } from './customizations.controller';

@Module({
  controllers: [CustomizationsController]
})
export class CustomizationsModule {}
