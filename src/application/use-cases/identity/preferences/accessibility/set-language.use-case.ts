import { Injectable } from '@nestjs/common';
import {
  SetLanguageDto,
  SetLanguageResponseDto,
} from '@/application/dto/identity/preferences';

@Injectable()
export class SetLanguageUseCase {
  constructor() {}

  async execute(dto: SetLanguageDto): Promise<SetLanguageResponseDto> {
    return {
      id: 'stub-id',
      language: dto.language,
      appliesImmediately: true,
      updatedAt: new Date(),
    };
  }
}