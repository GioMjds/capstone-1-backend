import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { IUserRepository } from '@/domain/repositories';

@Injectable()
export class SetUserPermissionUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(id: string) {
    const user = await this.userRepository.findById(id);
    if (!user) throw new NotFoundException('User not found');
  }
}
