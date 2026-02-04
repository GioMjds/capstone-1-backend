import { Injectable } from '@nestjs/common';
import {
  GetSecurityEventsDto,
  GetSecurityEventsResponseDto,
} from '@/application/dto/identity/preferences';

@Injectable()
export class GetSecurityEventsUseCase {
  constructor() {}

  async execute(dto: GetSecurityEventsDto): Promise<GetSecurityEventsResponseDto> {
    return {
      totalCount: 0,
      events: [],
      page: dto.page ?? 1,
      limit: dto.limit ?? 20,
      totalPages: 0,
    };
  }
}
