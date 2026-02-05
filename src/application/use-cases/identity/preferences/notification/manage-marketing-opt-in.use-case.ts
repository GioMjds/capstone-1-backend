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
      emailMarketing: dto.emailMarketing ?? false,
      smsMarketing: dto.smsMarketing ?? false,
      pushMarketing: dto.pushMarketing ?? false,
      thirdPartySharing: dto.thirdPartySharing ?? false,
      updatedAt: new Date(),
    };
  }
}
