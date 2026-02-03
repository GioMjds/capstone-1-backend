import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infrastructure/persistence';
import { UpdateUiPreferencesDto } from '@/application/dto/identity/preferences';
import { UIPreferencesValueObject } from '@/domain/value-objects/identity';
import { randomUUID } from 'crypto';

@Injectable()
export class UpdateUiPreferencesUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(
    userId: string,
    dto: UpdateUiPreferencesDto,
  ): Promise<UIPreferencesValueObject> {
    const userPreferences = await this.prisma.userPreferences.findUnique({
      where: { userId },
    });

    if (!userPreferences) {
      const newPreferences = await this.prisma.userPreferences.create({
        data: {
          id: randomUUID().replace(/-/g, '').substring(0, 12),
          userId,
          uiPreferences: {
            theme: dto.theme ?? 'light',
            language: dto.language ?? 'en',
            timezone: dto.timezone,
            locale: dto.locale,
          },
        },
      });

      return UIPreferencesValueObject.fromPersistence(
        (newPreferences.uiPreferences ?? {}) as Record<string, string>,
      );
    }

    const currentUiPreferences = userPreferences.uiPreferences as Record<
      string,
      any
    >;
    const updatedUiPreferences = {
      ...currentUiPreferences,
      ...(dto.theme && { theme: dto.theme }),
      ...(dto.language && { language: dto.language }),
      ...(dto.timezone && { timezone: dto.timezone }),
      ...(dto.locale && { locale: dto.locale }),
    };

    await this.prisma.userPreferences.update({
      where: { userId },
      data: {
        uiPreferences: updatedUiPreferences,
        updatedAt: new Date(),
      },
    });

    return UIPreferencesValueObject.fromPersistence(updatedUiPreferences);
  }
}
