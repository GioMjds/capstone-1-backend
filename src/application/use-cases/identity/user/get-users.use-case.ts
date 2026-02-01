import { Injectable, Inject } from '@nestjs/common';
import type { IUserRepository } from '@/domain/repositories';
import { GetUsersResponseDto } from '@/application/dto/user';
import { UserEntity } from '@/domain/entities';
import { UserResponseDto } from '@/application/dto/responses';

@Injectable()
export class GetUsersUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  private toResponse(user: UserEntity): UserResponseDto {
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
    }
  }

  async execute(page = 1, limit = 20): Promise<GetUsersResponseDto> {
    const users = await this.userRepository.findAll(page, limit);
    return {
      page: page,
      limit: limit,
      users: users.map((user) => this.toResponse(user)),
    }
  }
}
