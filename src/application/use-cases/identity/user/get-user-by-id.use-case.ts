import { Injectable, Inject, NotFoundException } from "@nestjs/common";
import type { IUserRepository } from "@/domain/repositories";
import { GetUserByIdDto } from "@/application/dto/user";
import { UserEntity } from "@/domain/entities";

@Injectable()
export class GetUserByIdUseCase {
  constructor(
    @Inject("IUserRepository")
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(dto: GetUserByIdDto): Promise<UserEntity> {
    const user = await this.userRepository.findById(dto.id);
    if (!user) throw new NotFoundException("User not found");
    return user;
  }
}