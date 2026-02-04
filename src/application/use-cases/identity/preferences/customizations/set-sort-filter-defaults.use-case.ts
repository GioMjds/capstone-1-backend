import { Injectable } from '@nestjs/common';
import {
  SetSortFilterDefaultsDto,
  SortFilterDefaultsResponseDto,
} from '@/application/dto/identity/preferences';

@Injectable()
export class SetSortFilterDefaultsUseCase {
  constructor() {}

  async execute(dto: SetSortFilterDefaultsDto): Promise<SortFilterDefaultsResponseDto> {
    return {
      defaultSortField: dto.defaultSortField,
      defaultSortOrder: dto.defaultSortOrder,
      defaultFilters: dto.defaultFilters,
      updatedAt: new Date(),
    };
  }
}
