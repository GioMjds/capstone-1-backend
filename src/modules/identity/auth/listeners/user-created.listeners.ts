import { Injectable, Logger, Inject } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { UserCreatedEvent } from '@/application/events/identity';
import type { IUserPreferencesRepository } from '@/domain/repositories/identity/preferences';
import { UserPreferencesEntity } from '@/domain/entities/identity/preferences';
import { Theme } from '@/domain/interfaces';
import { generateUserId } from '@/shared/utils';
import { PrismaService } from '@/infrastructure/persistence';

@Injectable()
export class UserCreatedListener {
  private readonly logger = new Logger(UserCreatedListener.name);

  constructor(
    @Inject('IUserPreferencesRepository')
    private readonly preferencesRepository: IUserPreferencesRepository,
    private readonly prisma: PrismaService,
  ) {}

  @OnEvent('user.created')
  async handleUserCreated(event: UserCreatedEvent): Promise<void> {
    try {
      const existingPreferences = await this.preferencesRepository.findByUserId(
        event.userId,
      );

      if (existingPreferences) return;

      const defaultPreferences = new UserPreferencesEntity(
        generateUserId(),
        event.userId,
        Theme.LIGHT,
        'en',
        true,
      );

      const savedPreferences = await this.preferencesRepository.save(defaultPreferences);

      await this.prisma.userNotificationSettings.create({
        data: {
          id: generateUserId(),
          userPreferencesId: savedPreferences.id,
          emailNotifications: true,
          pushNotifications: false,
          smsNotifications: false,
          preferences: {
            digestFrequency: 'daily',
            securityAlerts: true,
          },
        },
      });
    } catch (error) {
      this.logger.error(
        `Failed to create default preferences for user: ${event.userId}`,
        error instanceof Error ? error.stack : error,
      );
    }
  }
}
