import { Inject, Injectable } from '@nestjs/common';
import {
  ConfigurePushNotificationsDto,
  PushNotificationCategoriesResponseDto,
} from '@/application/dto/identity/preferences';
import { INotificationRepository } from '@/domain/repositories/identity/preferences';

@Injectable()
export class ConfigurePushNotificationsByCategoryUseCase {
  constructor(
    @Inject('INotificationRepository')
    private readonly notificationRepository: INotificationRepository,
  ) {}

  async execute(userId: string, dto: ConfigurePushNotificationsDto): Promise<PushNotificationCategoriesResponseDto> {
    await this.notificationRepository.updateNotificationSettings(userId, {
      pushByCategory: dto.categories,
    });

    return {
      categories: dto.categories,
      updatedAt: new Date(),
    };
  }
}
