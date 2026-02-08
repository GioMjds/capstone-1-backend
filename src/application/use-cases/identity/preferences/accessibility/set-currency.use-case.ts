import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  SetCurrencyDto,
  SetCurrencyResponseDto,
} from '@/application/dto/identity/preferences';
import { IAccessibilityRepository } from '@/domain/repositories/identity/preferences';

@Injectable()
export class SetCurrencyUseCase {
  constructor(
    @Inject('IAccessibilityRepository')
    private readonly accessibilityRepository: IAccessibilityRepository,
  ) {}

  async execute(
    userId: string,
    dto: SetCurrencyDto,
  ): Promise<SetCurrencyResponseDto> {
    await this.accessibilityRepository.updateAccessibilitySettings(userId, {
      currency: dto.currency,
    });

    const settings =
      await this.accessibilityRepository.getAccessibilitySettings(userId);

    if (!settings) {
      throw new NotFoundException('Accessibility settings not found');
    }

    return {
      id: settings.id,
      currency: settings.currency,
      symbol: this.resolveCurrencySymbol(settings.currency),
      updatedAt: new Date(),
    };
  }

  private resolveCurrencySymbol(currencyCode: string): string {
    const symbols: Record<string, string> = {
      USD: '$',
      EUR: '€',
      GBP: '£',
      JPY: '¥',
      CNY: '¥',
      KRW: '₩',
      INR: '₹',
      BRL: 'R$',
      CAD: 'CA$',
      AUD: 'A$',
      PHP: '₱',
    };
    return symbols[currencyCode] ?? currencyCode;
  }
}
