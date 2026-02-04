import { Injectable } from '@nestjs/common';
import {
  GetDataAccessHistoryDto,
  GetDataAccessHistoryResponseDto,
} from '@/application/dto/identity/preferences';

@Injectable()
export class GetDataAccessHistoryUseCase {
  constructor() {}

  async execute(
    dto: GetDataAccessHistoryDto,
  ): Promise<GetDataAccessHistoryResponseDto> {
    return {
      totalCount: 0,
      accessEvents: [],
      page: dto.page ?? 1,
      limit: dto.limit ?? 20,
      totalPages: 0,
    };
  }
}
