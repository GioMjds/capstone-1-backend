import { Injectable } from '@nestjs/common';
import { ActiveSessionsResponseDto } from '@/application/dto/identity/preferences';

@Injectable()
export class ViewActiveSessionsUseCase {
  constructor() {}

  async execute(userId: string): Promise<ActiveSessionsResponseDto> {
    return {
      sessions: [],
      totalCount: 0,
      currentSessionCount: 0,
    };
  }
}