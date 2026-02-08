import { Inject, Injectable } from '@nestjs/common';
import { OnlinePresenceSettingsResponseDto } from '@/application/dto/identity/preferences';
import { IPrivacyRepository } from '@/domain/repositories/identity/preferences';

@Injectable()
export class GetOnlinePresenceSettingsUseCase {
  constructor(
    @Inject('IPrivacyRepository')
    private readonly privacyRepository: IPrivacyRepository,
  ) {}

  async execute(userId: string): Promise<OnlinePresenceSettingsResponseDto> {
    const settings = await this.privacyRepository.getPrivacySettings(userId);

    if (!settings) {
      return {
        showOnlineStatus: true,
        showTypingIndicator: true,
        showReadReceipts: false,
        updatedAt: new Date(),
      };
    }

    const presence = settings.onlinePresence ?? 'online';

    return {
      showOnlineStatus: presence !== 'hidden',
      showTypingIndicator: true,
      showReadReceipts: false,
      updatedAt: settings.updatedAt,
    };
  }
}
