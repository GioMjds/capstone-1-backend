import { Module } from '@nestjs/common';
import { DataOwnershipController } from './data-ownership.controller';

@Module({
  controllers: [DataOwnershipController]
})
export class DataOwnershipModule {}
