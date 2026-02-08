import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateComplianceSettingsDto, ComplianceSettingsResponseDto, AuditLogPreference } from '@/application/dto/identity/preferences';
import { IPrivacyRepository } from '@/domain/repositories/identity/preferences';
import { InvalidStateException } from '@/shared/exceptions';

@Injectable()
export class UpdateComplianceSettingsUseCase {
  constructor(
    @Inject('IPrivacyRepository')
    private readonly privacyRepository: IPrivacyRepository,
  ) {}

  async execute(
    userId: string,
    dto: UpdateComplianceSettingsDto,
  ): Promise<ComplianceSettingsResponseDto> {
    if (dto.dataRetentionMonths !== undefined && dto.dataRetentionMonths < 0) {
      throw new InvalidStateException(
        'Data retention months cannot be negative',
      );
    }

    await this.privacyRepository.updatePrivacySettings(userId, {
      allowThirdPartySharing: dto.dataShareConsent,
    });

    const settings = await this.privacyRepository.getPrivacySettings(userId);

    return {
      dataShareConsent: settings?.allowThirdPartySharing ?? dto.dataShareConsent ?? false,
      dataRetentionMonths: dto.dataRetentionMonths ?? 12,
      allowAccountDeletion: dto.allowAccountDeletion ?? true,
      auditLogPreference: (dto.auditLogPreference as AuditLogPreference) ?? AuditLogPreference.MINIMAL,
      createdAt: settings?.createdAt ?? new Date(),
      updatedAt: settings?.updatedAt ?? new Date(),
    };
  }
}
