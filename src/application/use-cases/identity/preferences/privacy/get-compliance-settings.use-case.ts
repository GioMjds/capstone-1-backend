import { Injectable, Inject } from '@nestjs/common';
import {
  ComplianceSettingsResponseDto,
  AuditLogPreference,
} from '@/application/dto/identity/preferences';
import { IPrivacyRepository } from '@/domain/repositories/identity/preferences';

@Injectable()
export class GetComplianceSettingsUseCase {
  constructor(
    @Inject('IPrivacyRepository')
    private readonly privacyRepository: IPrivacyRepository,
  ) {}

  async execute(userId: string): Promise<ComplianceSettingsResponseDto> {
    const settings = await this.privacyRepository.getPrivacySettings(userId);

    if (!settings) {
      return {
        dataShareConsent: false,
        dataRetentionMonths: 12,
        allowAccountDeletion: true,
        auditLogPreference: AuditLogPreference.MINIMAL,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }

    return {
      dataShareConsent: settings.allowThirdPartySharing ?? false,
      dataRetentionMonths: 12,
      allowAccountDeletion: true,
      auditLogPreference: AuditLogPreference.MINIMAL,
      createdAt: settings.createdAt,
      updatedAt: settings.updatedAt,
    };
  }
}
