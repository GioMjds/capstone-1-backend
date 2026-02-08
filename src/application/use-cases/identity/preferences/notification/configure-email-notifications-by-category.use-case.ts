import { Inject, Injectable } from '@nestjs/common';
import {
  ConfigureEmailNotificationsDto,
  EmailNotificationCategoriesResponseDto,
} from '@/application/dto/identity/preferences';
import { INotificationRepository } from '@/domain/repositories/identity/preferences';

@Injectable()
export class ConfigureEmailNotificationsByCategoryUseCase {
  constructor(
    @Inject('INotificationRepository')
    private readonly notificationRepository: INotificationRepository,
  ) {}

  async execute(userId: string, dto: ConfigureEmailNotificationsDto): Promise<EmailNotificationCategoriesResponseDto> {
    await this.notificationRepository.updateNotificationSettings(userId, {
      emailByCategory: dto.categories,
    });

    return {
      categories: dto.categories,
      updatedAt: new Date(),
    };
  }
}
