import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  ManageRecoveryOptionsDto,
  ManageRecoveryOptionsResponseDto,
} from '@/application/dto/identity/preferences';
import { IUserRepository } from '@/domain/repositories';

@Injectable()
export class ManageRecoveryOptionsUseCase {
  constructor(
    @Inject('IUserRepository') 
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(
    id: string,
    dto: ManageRecoveryOptionsDto,
  ): Promise<ManageRecoveryOptionsResponseDto> {
    const user = await this.userRepository.findById(id);
    if (!user) throw new NotFoundException('User not found');

    return {
      id: user.id,
      type: dto.type,
      isVerified: dto.action === 'verify' ? true : false,
      updatedAt: new Date(),
    };
  }
}
