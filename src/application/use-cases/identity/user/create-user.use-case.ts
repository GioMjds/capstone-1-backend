import { Injectable, Inject } from '@nestjs/common';
import type { IUserRepository } from '@/domain/repositories';

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async execute() {}
}
