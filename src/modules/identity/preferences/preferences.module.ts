import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserMapper } from '@/infrastructure/persistence/prisma/mappers';
import { PrismaService } from '@/infrastructure/persistence';
import { USER_PREFERENCES_USE_CASES } from '@/application/use-cases/identity/preferences';
import { AccessibilityController } from './accessibility/accessibility.controller';
import { AccountControlsController } from './account-controls/account-controls.controller';
import { ActivityController } from './activity/activity.controller';
import { CustomizationsController } from './customizations/customizations.controller';
import { DataOwnershipController } from './data-ownership/data-ownership.controller';
import { NotificationController } from './notification/notification.controller';
import { PrivacyController } from './privacy/privacy.controller';
import { SecurityController } from './security/security.controller';
import { PrismaUserRepository } from '@/infrastructure/persistence/prisma/repositories';

@Module({
  imports: [ConfigModule],
  controllers: [
    AccessibilityController,
    AccountControlsController,
    ActivityController,
    CustomizationsController,
    DataOwnershipController,
    NotificationController,
    PrivacyController,
    SecurityController,
  ],
  providers: [
    JwtService,
    UserMapper,
    PrismaService,
    ...USER_PREFERENCES_USE_CASES,
    {
      provide: 'IUserRepository',
      useClass: PrismaUserRepository,
    },
    UserMapper,
  ],
  exports: [
    JwtService,
    UserMapper,
    PrismaService,
    ...USER_PREFERENCES_USE_CASES,
  ],
})
export class PreferencesModule {}
