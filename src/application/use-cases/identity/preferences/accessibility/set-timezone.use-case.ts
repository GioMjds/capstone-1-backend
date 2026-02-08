import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  SetTimezoneDto,
  SetTimezoneResponseDto,
} from '@/application/dto/identity/preferences';
import { IAccessibilityRepository } from '@/domain/repositories/identity/preferences';

@Injectable()
export class SetTimezoneUseCase {
  constructor(
    @Inject('IAccessibilityRepository')
    private readonly accessibilityRepository: IAccessibilityRepository,
  ) {}

  async execute(
    userId: string,
    dto: SetTimezoneDto,
  ): Promise<SetTimezoneResponseDto> {
    await this.accessibilityRepository.updateAccessibilitySettings(userId, {
      timezone: dto.timezone,
    });

    const settings =
      await this.accessibilityRepository.getAccessibilitySettings(userId);

    if (!settings) {
      throw new NotFoundException('Accessibility settings not found');
    }

    return {
      id: settings.id,
      timezone: settings.timezone,
      utcOffset: this.computeUtcOffset(settings.timezone),
      updatedAt: new Date(),
    };
  }

  private computeUtcOffset(timezone: string): string {
    try {
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
        timeZoneName: 'longOffset',
      });
      const parts = formatter.formatToParts(new Date());
      return parts.find((p) => p.type === 'timeZoneName')?.value ?? 'GMT+00:00';
    } catch {
      return 'GMT+00:00';
    }
  }
}
