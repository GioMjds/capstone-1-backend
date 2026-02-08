import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  SetTimeFormatDto,
  SetTimeFormatResponseDto,
} from '@/application/dto/identity/preferences';
import { TimeFormat } from '@/domain/interfaces';
import { IAccessibilityRepository } from '@/domain/repositories/identity/preferences';

@Injectable()
export class SetTimeFormatUseCase {
  constructor(
    @Inject('IAccessibilityRepository')
    private readonly accessibilityRepository: IAccessibilityRepository,
  ) {}

  async execute(
    userId: string,
    dto: SetTimeFormatDto,
  ): Promise<SetTimeFormatResponseDto> {
    await this.accessibilityRepository.updateAccessibilitySettings(userId, {
      timeFormat: dto.format,
    });

    const settings =
      await this.accessibilityRepository.getAccessibilitySettings(userId);

    if (!settings) {
      throw new NotFoundException('Accessibility settings not found');
    }

    const format = settings.timeFormat as TimeFormat;

    return {
      id: settings.id,
      format,
      example: format === TimeFormat.TWELVE_HOUR ? '12:30 PM' : '12:30',
      updatedAt: new Date(),
    };
  }
}
