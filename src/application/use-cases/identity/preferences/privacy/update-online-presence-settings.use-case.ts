import { Injectable } from '@nestjs/common';
import {
  UpdateOnlinePresenceSettingsDto,
  OnlinePresenceSettingsResponseDto,
} from '@/application/dto/identity/preferences';

@Injectable()
export class UpdateOnlinePresenceSettingsUseCase {
  constructor() {}

  async execute(dto: UpdateOnlinePresenceSettingsDto): Promise<OnlinePresenceSettingsResponseDto> {
    return {
      showOnlineStatus: dto.showOnlineStatus,
      showTypingIndicator: dto.showTypingIndicator,
      showReadReceipts: dto.showReadReceipts,
      updatedAt: new Date(),
    };
  }
}
