import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserMapper } from '@/infrastructure/persistence/prisma/mappers';
import { PrismaService } from '@/infrastructure/persistence';
import { PrismaUserRepository } from '@/infrastructure/persistence/prisma/repositories';
import {
  PrismaUserPreferencesRepository,
  PrismaSessionRepository,
  PrismaActivityRepository,
  PrismaAccessibilityRepository,
  PrismaAccountControlsRepository,
  PrismaCustomizationsRepository,
  PrismaDataOwnershipRepository,
  PrismaNotificationRepository,
  PrismaPrivacyRepository,
  PrismaSecurityRepository,
} from '@/infrastructure/persistence/prisma/repositories';
import {
  PreferencesMapper,
  SessionMapper,
  ActivityMapper,
  AccessibilityMapper,
  AccountControlsMapper,
  CustomizationsMapper,
  DataOwnershipMapper,
  NotificationMapper,
  PrivacyMapper,
  SecurityMapper,
} from '@/infrastructure/persistence/prisma/mappers';
import { USER_PREFERENCES_USE_CASES } from '@/application/use-cases/identity/preferences';
import { AccessibilityController } from './accessibility/accessibility.controller';
import { AccountControlsController } from './account-controls/account-controls.controller';
import { ActivityController } from './activity/activity.controller';
import { CustomizationsController } from './customizations/customizations.controller';
import { DataOwnershipController } from './data-ownership/data-ownership.controller';
import { NotificationController } from './notification/notification.controller';
import { PrivacyController } from './privacy/privacy.controller';
import { SecurityController } from './security/security.controller';

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
    PreferencesMapper,
    SessionMapper,
    ActivityMapper,
    AccessibilityMapper,
    AccountControlsMapper,
    CustomizationsMapper,
    DataOwnershipMapper,
    NotificationMapper,
    PrivacyMapper,
    SecurityMapper,
    ...USER_PREFERENCES_USE_CASES,
    {
      provide: 'IUserRepository',
      useClass: PrismaUserRepository,
    },
    {
      provide: 'IUserPreferencesRepository',
      useClass: PrismaUserPreferencesRepository,
    },
    {
      provide: 'ISessionRepository',
      useClass: PrismaSessionRepository,
    },
    {
      provide: 'IActivityRepository',
      useClass: PrismaActivityRepository,
    },
    {
      provide: 'IAccessibilityRepository',
      useClass: PrismaAccessibilityRepository,
    },
    {
      provide: 'IAccountControlsRepository',
      useClass: PrismaAccountControlsRepository,
    },
    {
      provide: 'ICustomizationsRepository',
      useClass: PrismaCustomizationsRepository,
    },
    {
      provide: 'IDataOwnershipRepository',
      useClass: PrismaDataOwnershipRepository,
    },
    {
      provide: 'INotificationRepository',
      useClass: PrismaNotificationRepository,
    },
    {
      provide: 'IPrivacyRepository',
      useClass: PrismaPrivacyRepository,
    },
    {
      provide: 'ISecurityRepository',
      useClass: PrismaSecurityRepository,
    },
  ],
  exports: [
    JwtService,
    UserMapper,
    PrismaService,
    ...USER_PREFERENCES_USE_CASES,
    'IUserRepository',
    'IUserPreferencesRepository',
    'ISessionRepository',
    'IActivityRepository',
    'IAccessibilityRepository',
    'IAccountControlsRepository',
    'ICustomizationsRepository',
    'IDataOwnershipRepository',
    'INotificationRepository',
    'IPrivacyRepository',
    'ISecurityRepository',
  ],
})
export class PreferencesModule {}
