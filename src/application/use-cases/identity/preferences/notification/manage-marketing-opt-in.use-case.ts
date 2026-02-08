import { Inject, Injectable } from '@nestjs/common';
import {
  ManageMarketingOptInDto,
  MarketingOptInResponseDto,
} from '@/application/dto/identity/preferences';
import { INotificationRepository } from '@/domain/repositories/identity/preferences';

@Injectable()
export class ManageMarketingOptInUseCase {
  constructor(
    @Inject('INotificationRepository')
    private readonly notificationRepository: INotificationRepository,
  ) {}

  async execute(userId: string, dto: ManageMarketingOptInDto): Promise<MarketingOptInResponseDto> {
    await this.notificationRepository.updateMarketingOptIn(
      userId,
      dto.emailMarketing ?? false,
    );

    return {
      emailMarketing: dto.emailMarketing ?? false,
      smsMarketing: dto.smsMarketing ?? false,
      pushMarketing: dto.pushMarketing ?? false,
      thirdPartySharing: dto.thirdPartySharing ?? false,
      updatedAt: new Date(),
    };
  }
}
