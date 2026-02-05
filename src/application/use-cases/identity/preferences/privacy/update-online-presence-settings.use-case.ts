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
      showOnlineStatus: dto.showOnlineStatus ?? true,
      showTypingIndicator: dto.showTypingIndicator ?? true,
      showReadReceipts: dto.showReadReceipts ?? false,
      updatedAt: new Date(),
    };
  }
}
