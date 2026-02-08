import { Inject, Injectable } from '@nestjs/common';
import {
  UpdateOnlinePresenceSettingsDto,
  OnlinePresenceSettingsResponseDto,
} from '@/application/dto/identity/preferences';
import { IPrivacyRepository } from '@/domain/repositories/identity/preferences';

@Injectable()
export class UpdateOnlinePresenceSettingsUseCase {
  constructor(
    @Inject('IPrivacyRepository')
    private readonly privacyRepository: IPrivacyRepository,
  ) {}

  async execute(userId: string, dto: UpdateOnlinePresenceSettingsDto): Promise<OnlinePresenceSettingsResponseDto> {
    const presence = dto.showOnlineStatus ? 'online' : 'hidden';
    await this.privacyRepository.updateOnlinePresence(userId, presence);

    return {
      showOnlineStatus: dto.showOnlineStatus ?? true,
      showTypingIndicator: dto.showTypingIndicator ?? true,
      showReadReceipts: dto.showReadReceipts ?? false,
      updatedAt: new Date(),
    };
  }
}
