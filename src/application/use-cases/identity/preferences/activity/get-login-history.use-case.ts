import { Injectable } from '@nestjs/common';
import {
  GetLoginHistoryDto,
  GetLoginHistoryResponseDto,
} from '@/application/dto/identity/preferences';

@Injectable()
export class GetLoginHistoryUseCase {
  constructor() {}

  async execute(dto: GetLoginHistoryDto): Promise<GetLoginHistoryResponseDto> {
    return {
      totalCount: 0,
      loginAttempts: [],
      page: dto.page ?? 1,
      limit: dto.limit ?? 20,
      totalPages: 0,
    };
  }
}
