import { Injectable } from '@nestjs/common';
import {
  ConfigurePushNotificationsDto,
  PushNotificationCategoriesResponseDto,
} from '@/application/dto/identity/preferences';

@Injectable()
export class ConfigurePushNotificationsByCategoryUseCase {
  constructor() {}

  async execute(dto: ConfigurePushNotificationsDto): Promise<PushNotificationCategoriesResponseDto> {
    return {
      categories: dto.categories,
      updatedAt: new Date(),
    };
  }
}
