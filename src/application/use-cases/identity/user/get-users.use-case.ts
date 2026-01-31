import { Injectable, Inject } from '@nestjs/common';
import type { IUserRepository } from '@/domain/repositories';
import { UserEntity } from '@/domain/entities';

@Injectable()
export class GetUsersUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(page = 1, limit = 20): Promise<UserEntity[]> {
    return this.userRepository.findAll(page, limit);
  }
}
