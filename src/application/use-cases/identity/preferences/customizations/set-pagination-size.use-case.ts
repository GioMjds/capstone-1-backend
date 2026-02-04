import { Injectable } from '@nestjs/common';
import {
  SetPaginationSizeDto,
  PaginationSizeResponseDto,
} from '@/application/dto/identity/preferences';

@Injectable()
export class SetPaginationSizeUseCase {
  constructor() {}

  async execute(dto: SetPaginationSizeDto): Promise<PaginationSizeResponseDto> {
    return {
      defaultPageSize: dto.defaultPageSize,
      maxPageSize: dto.maxPageSize,
      updatedAt: new Date(),
    };
  }
}
