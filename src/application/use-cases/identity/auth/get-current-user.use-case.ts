import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import type { IUserRepository } from '@/domain/repositories';
import { UserResponseDto } from '@/application/dto/responses';

@Injectable()
export class GetCurrentUserUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(userId: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findById(userId);

    if (!user) throw new NotFoundException('User not found');

    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email.getValue(),
      phone: user.phone?.getValue() ?? null,
      isActive: user.isActive,
      isEmailVerified: user.isEmailVerified,
      role: user.role,
      archivedAt: user.archivedAt,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
