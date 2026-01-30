import { Injectable, Inject } from '@nestjs/common';
import type { IUserRepository } from '@/domain/repositories';

@Injectable()
export class GetUserUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async execute() {}
}
