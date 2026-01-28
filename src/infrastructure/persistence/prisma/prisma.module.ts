import { Global, Module } from '@nestjs/common';
import { PrismaService } from '@/infrastructure/persistence';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}