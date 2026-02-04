import { Injectable } from '@nestjs/common';
import {
  ChangeUsernameDto,
  ChangeUsernameResponseDto,
} from '@/application/dto/identity/preferences';

@Injectable()
export class ChangeUsernameUseCase {
  constructor() {}

  async execute(dto: ChangeUsernameDto): Promise<ChangeUsernameResponseDto> {
    return {
      id: 'stub-id',
      username: dto.newUsername,
      updatedAt: new Date(),
    };
  }
}
