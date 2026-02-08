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
    let userPreferences = await this.prisma.userPreferences.findUnique({
      where: { userId },
      include: {
        accessibilitySettings: true,
        customizationSettings: true,
      },
    });

    const generateId = () => randomUUID().replace(/-/g, '').substring(0, 12);

    if (!userPreferences) {
      userPreferences = await this.prisma.userPreferences.create({
        data: {
          id: generateId(),
          userId,
          accessibilitySettings: {
            create: {
              id: generateId(),
              language: dto.language ?? 'en',
              timezone: dto.timezone ?? 'UTC',
            },
          },
          customizationSettings: {
            create: {
              id: generateId(),
              theme: dto.theme ?? 'system',
            },
          },
        },
        include: {
          accessibilitySettings: true,
          customizationSettings: true,
        },
      });
    } else {
      if (dto.theme) {
        await this.prisma.customizationSettings.upsert({
          where: { userPreferencesId: userPreferences.id },
          update: { theme: dto.theme },
          create: {
            id: generateId(),
            userPreferencesId: userPreferences.id,
            theme: dto.theme,
          },
        });
      }

      if (dto.language || dto.timezone) {
        await this.prisma.accessibilitySettings.upsert({
          where: { userPreferencesId: userPreferences.id },
          update: {
            ...(dto.language && { language: dto.language }),
            ...(dto.timezone && { timezone: dto.timezone }),
          },
          create: {
            id: generateId(),
            userPreferencesId: userPreferences.id,
            language: dto.language ?? 'en',
            timezone: dto.timezone ?? 'UTC',
          },
        });
      }

      userPreferences = await this.prisma.userPreferences.findUnique({
        where: { userId },
        include: {
          accessibilitySettings: true,
          customizationSettings: true,
        },
      });
    }

    return UIPreferencesValueObject.fromPersistence({
      theme: userPreferences?.customizationSettings?.theme ?? 'system',
      language: userPreferences?.accessibilitySettings?.language ?? 'en',
      timezone: userPreferences?.accessibilitySettings?.timezone,
      locale: dto.locale,
    });
  }
}
