import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ActiveSessionsResponseDto } from '@/application/dto/identity/preferences';
import { IUserRepository } from '@/domain/repositories';

@Injectable()
export class ViewActiveSessionsUseCase {
  constructor(
    @Inject('IUserRepository') 
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(userId: string): Promise<ActiveSessionsResponseDto> {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    return {
      sessions: [],
      totalCount: 0,
      currentSessionCount: 0,
    };
  }
}
