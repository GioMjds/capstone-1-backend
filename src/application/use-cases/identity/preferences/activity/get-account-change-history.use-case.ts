import { Injectable } from '@nestjs/common';
import {
  GetAccountChangeHistoryDto,
  GetAccountChangeHistoryResponseDto,
} from '@/application/dto/identity/preferences';

@Injectable()
export class GetAccountChangeHistoryUseCase {
  constructor() {}

  async execute(
    dto: GetAccountChangeHistoryDto,
  ): Promise<GetAccountChangeHistoryResponseDto> {
    return {
      totalCount: 0,
      changes: [],
      page: dto.page ?? 1,
      limit: dto.limit ?? 20,
      totalPages: 0,
    };
  }
}
