import { Injectable } from '@nestjs/common';
import {
  SetSortFilterDefaultsDto,
  SortFilterDefaultsResponseDto,
  SortOrder,
} from '@/application/dto/identity/preferences';

@Injectable()
export class SetSortFilterDefaultsUseCase {
  constructor() {}

  async execute(dto: SetSortFilterDefaultsDto): Promise<SortFilterDefaultsResponseDto> {
    return {
      defaultSortField: dto.defaultSortField ?? 'createdAt',
      defaultSortOrder: dto.defaultSortOrder ?? SortOrder.DESC,
      defaultFilters: dto.defaultFilters,
      updatedAt: new Date(),
    };
  }
}
