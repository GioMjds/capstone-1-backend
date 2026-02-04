import { Injectable } from '@nestjs/common';
import {
  ConfigureEmailNotificationsDto,
  EmailNotificationCategoriesResponseDto,
} from '@/application/dto/identity/preferences';

@Injectable()
export class ConfigureEmailNotificationsByCategoryUseCase {
  constructor() {}

  async execute(dto: ConfigureEmailNotificationsDto): Promise<EmailNotificationCategoriesResponseDto> {
    return {
      categories: dto.categories,
      updatedAt: new Date(),
    };
  }
}
