import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  SetDateNumberFormatsDto,
  SetDateNumberFormatsResponseDto,
} from '@/application/dto/identity/preferences';
import { IAccessibilityRepository } from '@/domain/repositories/identity/preferences';

@Injectable()
export class SetDateNumberFormatsUseCase {
  constructor(
    @Inject('IAccessibilityRepository')
    private readonly accessibilityRepository: IAccessibilityRepository,
  ) {}

  async execute(
    userId: string,
    dto: SetDateNumberFormatsDto,
  ): Promise<SetDateNumberFormatsResponseDto> {
    await this.accessibilityRepository.updateAccessibilitySettings(userId, {
      dateFormat: dto.dateFormat,
      numberFormat: dto.numberLocale,
    });

    const settings =
      await this.accessibilityRepository.getAccessibilitySettings(userId);

    if (!settings) {
      throw new NotFoundException('Accessibility settings not found');
    }

    return {
      id: settings.id,
      dateFormat: settings.dateFormat,
      numberLocale: settings.numberFormat,
      decimalSeparator: dto.decimalSeparator ?? '.',
      thousandsSeparator: dto.thousandsSeparator ?? ',',
      updatedAt: new Date(),
    };
  }
}
