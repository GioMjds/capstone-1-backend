import { Injectable } from '@nestjs/common';
import {
  GetPermissionChangeHistoryDto,
  GetPermissionChangeHistoryResponseDto,
} from '@/application/dto/identity/preferences';

@Injectable()
export class GetPermissionChangeHistoryUseCase {
  constructor() {}

  async execute(
    dto: GetPermissionChangeHistoryDto,
  ): Promise<GetPermissionChangeHistoryResponseDto> {
    return {
      totalCount: 0,
      permissionChanges: [],
      page: dto.page ?? 1,
      limit: dto.limit ?? 20,
      totalPages: 0,
    };
  }
}
