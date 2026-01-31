import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import type { IUserRepository } from '@/domain/repositories';
import { ArchiveUserDto } from '@/application/dto/user';
import { UserEntity } from '@/domain/entities';

@Injectable()
export class ArchiveUserUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(dto: ArchiveUserDto): Promise<UserEntity> {
    const archived = await this.userRepository.archive(dto.id);
    if (!archived) throw new NotFoundException("Archived user not found.");
    return archived;
  }
}
