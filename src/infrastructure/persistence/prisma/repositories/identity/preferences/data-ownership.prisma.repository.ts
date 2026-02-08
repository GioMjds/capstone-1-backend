import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '@/infrastructure/persistence';
import { IDataOwnershipRepository } from '@/domain/repositories/identity/preferences';
import { DataOwnershipMapper } from '@/infrastructure/persistence/prisma/mappers/identity/preferences';
import { IDataOwnershipSettings } from '@/domain/interfaces';
import { generateUserId } from '@/shared/utils';

@Injectable()
export class PrismaDataOwnershipRepository implements IDataOwnershipRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mapper: DataOwnershipMapper,
  ) {}

  private async getUserPreferencesId(userId: string): Promise<string | null> {
    const preferences = await this.prisma.userPreferences.findUnique({
      where: { userId },
      select: { id: true },
    });
    return preferences?.id ?? null;
  }

  async getDataOwnershipSettings(
    userId: string,
  ): Promise<IDataOwnershipSettings | null> {
    const preferencesId = await this.getUserPreferencesId(userId);
    if (!preferencesId) return null;

    const settings = await this.prisma.dataOwnershipSettings.findUnique({
      where: { userPreferencesId: preferencesId },
    });

    return settings ? this.mapper.toDomain(settings) : null;
  }

  async updateDataOwnershipSettings(
    userId: string,
    settings: Partial<IDataOwnershipSettings>,
  ): Promise<void> {
    const preferencesId = await this.getUserPreferencesId(userId);
    if (!preferencesId) return;

    await this.prisma.dataOwnershipSettings.upsert({
      where: { userPreferencesId: preferencesId },
      update: {
        exportFormat: settings.exportFormat,
        dataRetentionDays: settings.dataRetentionDays,
        allowAutoDelete: settings.allowAutoDelete,
        allowDataAnonymization: settings.allowDataAnonymization,
        dataExportRequests: settings.dataExportRequests as unknown as Prisma.InputJsonValue,
        dataDeletionRequests: settings.dataDeletionRequests as unknown as Prisma.InputJsonValue,
        dataCorrections: settings.dataCorrections as unknown as Prisma.InputJsonValue,
      },
      create: {
        id: generateUserId(),
        userPreferencesId: preferencesId,
        exportFormat: settings.exportFormat ?? 'json',
        dataRetentionDays: settings.dataRetentionDays ?? 365,
        allowAutoDelete: settings.allowAutoDelete ?? false,
        allowDataAnonymization: settings.allowDataAnonymization ?? false,
        dataExportRequests: (settings.dataExportRequests ?? []) as unknown as Prisma.InputJsonValue,
        dataDeletionRequests: (settings.dataDeletionRequests ?? []) as unknown as Prisma.InputJsonValue,
        dataCorrections: (settings.dataCorrections ?? []) as unknown as Prisma.InputJsonValue,
      },
    });
  }

  async updateExportFormat(userId: string, format: string): Promise<void> {
    const preferencesId = await this.getUserPreferencesId(userId);
    if (!preferencesId) return;

    await this.prisma.dataOwnershipSettings.update({
      where: { userPreferencesId: preferencesId },
      data: { exportFormat: format },
    });
  }
}
