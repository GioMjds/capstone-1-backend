import { Injectable } from '@nestjs/common';
import { OnlinePresenceSettingsResponseDto } from '@/application/dto/identity/preferences';

@Injectable()
export class GetOnlinePresenceSettingsUseCase {
  constructor() {}

  async execute(userId: string): Promise<OnlinePresenceSettingsResponseDto> {
    return {
      showOnlineStatus: true,
      showTypingIndicator: true,
      showReadReceipts: false,
      updatedAt: new Date(),
    };
  }
}
