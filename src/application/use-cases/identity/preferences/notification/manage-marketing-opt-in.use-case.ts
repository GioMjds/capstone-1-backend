import { Injectable } from '@nestjs/common';
import {
  ManageMarketingOptInDto,
  MarketingOptInResponseDto,
} from '@/application/dto/identity/preferences';

@Injectable()
export class ManageMarketingOptInUseCase {
  constructor() {}

  async execute(dto: ManageMarketingOptInDto): Promise<MarketingOptInResponseDto> {
    return {
      emailMarketing: dto.emailMarketing,
      smsMarketing: dto.smsMarketing,
      pushMarketing: dto.pushMarketing,
      thirdPartySharing: dto.thirdPartySharing,
      updatedAt: new Date(),
    };
  }
}
