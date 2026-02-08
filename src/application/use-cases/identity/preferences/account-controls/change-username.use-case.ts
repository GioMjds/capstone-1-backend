import { Injectable } from '@nestjs/common';
import {
  ChangeUsernameDto,
  ChangeUsernameResponseDto,
} from '@/application/dto/identity/preferences';
import { uuidv4 } from '@/shared/utils';

@Injectable()
export class ChangeUsernameUseCase {
  constructor() {}

  async execute(dto: ChangeUsernameDto): Promise<ChangeUsernameResponseDto> {
    return {
      id: uuidv4().slice(0, 12),
      username: dto.newUsername,
      updatedAt: new Date(),
    };
  }
}
