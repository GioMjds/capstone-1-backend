import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { NotificationSettingsResponseDto } from '@/application/dto/identity/preferences';
import { IUserRepository } from '@/domain/repositories';

@Injectable()
export class GetNotificationSettingsUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(userId: string): Promise<NotificationSettingsResponseDto> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    const preferences = user.getPreferences();

    if (!preferences) {
      return {
        emailNotifications: true,
        pushNotifications: true,
        smsNotifications: false,
        digestFrequency: 'immediate',
        quietHoursStart: '',
        quietHoursEnd: '',
        securityAlerts: true,
      };
    }

    return {
      emailNotifications: true,
      pushNotifications: true,
      smsNotifications: false,
      digestFrequency: 'immediate',
      quietHoursStart: '',
      quietHoursEnd: '',
      securityAlerts: true,
    };
  }
}
