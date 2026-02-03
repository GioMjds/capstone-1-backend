import { Module } from '@nestjs/common';
import { AuthModule } from './auth';
import { UsersModule } from './users';
import { PreferencesModule } from './preferences';

@Module({
  imports: [AuthModule, UsersModule, PreferencesModule],
  exports: [AuthModule, UsersModule, PreferencesModule],
})
export class IdentityModule {}
