import { Injectable } from '@nestjs/common';
import { UpdateComplianceSettingsDto } from '@/application/dto/identity/preferences';
import { ComplianceSettingsValueObject } from '@/domain/value-objects/identity';
import { PrismaService } from '@/infrastructure/persistence';
import { InvalidStateException } from '@/shared/exceptions';
import { randomUUID } from 'crypto';

@Injectable()
export class UpdateComplianceSettingsUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(
    userId: string,
    dto: UpdateComplianceSettingsDto,
  ): Promise<ComplianceSettingsValueObject> {
    if (dto.dataRetentionMonths !== undefined && dto.dataRetentionMonths < 0) {
      throw new InvalidStateException(
        'Data retention months cannot be negative',
      );
    }

    let userPreferences = await this.prisma.userPreferences.findUnique({
      where: { userId },
      include: { complianceSettings: true },
    });

    if (!userPreferences) {
      const preferencesId = randomUUID().replace(/-/g, '').substring(0, 12);
      userPreferences = await this.prisma.userPreferences.create({
        data: {
          id: preferencesId,
          userId,
          complianceSettings: {
            create: {
              id: randomUUID().replace(/-/g, '').substring(0, 12),
              dataShareConsent: dto.dataShareConsent ?? false,
              dataRetentionMonths: dto.dataRetentionMonths ?? 12,
              allowAccountDeletion: dto.allowAccountDeletion ?? true,
              auditLogPreference: dto.auditLogPreference ?? 'full',
            },
          },
        },
        include: { complianceSettings: true },
      });
    } else if (!userPreferences.complianceSettings) {
      await this.prisma.userComplianceSettings.create({
        data: {
          id: randomUUID().replace(/-/g, '').substring(0, 12),
          userPreferencesId: userPreferences.id,
          dataShareConsent: dto.dataShareConsent ?? false,
          dataRetentionMonths: dto.dataRetentionMonths ?? 12,
          allowAccountDeletion: dto.allowAccountDeletion ?? true,
          auditLogPreference: dto.auditLogPreference ?? 'full',
        },
      });

      userPreferences = await this.prisma.userPreferences.findUnique({
        where: { userId },
        include: { complianceSettings: true },
      });
    } else {
      await this.prisma.userComplianceSettings.update({
        where: { id: userPreferences.complianceSettings.id },
        data: {
          ...(dto.dataShareConsent !== undefined && {
            dataShareConsent: dto.dataShareConsent,
          }),
          ...(dto.dataRetentionMonths !== undefined && {
            dataRetentionMonths: dto.dataRetentionMonths,
          }),
          ...(dto.allowAccountDeletion !== undefined && {
            allowAccountDeletion: dto.allowAccountDeletion,
          }),
          ...(dto.auditLogPreference && {
            auditLogPreference: dto.auditLogPreference,
          }),
          updatedAt: new Date(),
        },
      });

      userPreferences = await this.prisma.userPreferences.findUnique({
        where: { userId },
        include: { complianceSettings: true },
      });
    }

    const complianceSettings = {
      dataShareConsent: userPreferences?.complianceSettings?.dataShareConsent,
      dataRetentionMonths:
        userPreferences?.complianceSettings?.dataRetentionMonths,
      allowAccountDeletion:
        userPreferences?.complianceSettings?.allowAccountDeletion,
      auditLogPreference:
        userPreferences?.complianceSettings?.auditLogPreference,
    };

    return ComplianceSettingsValueObject.fromPersistence(complianceSettings);
  }
}
