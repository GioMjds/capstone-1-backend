import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import {
  ComplianceSettingsResponseDto,
  AuditLogPreference,
} from '@/application/dto/identity/preferences';
import { IUserRepository } from '@/domain/repositories';

@Injectable()
export class GetComplianceSettingsUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(userId: string): Promise<ComplianceSettingsResponseDto> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    const preferences = user.getPreferences();

    if (!preferences) {
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
      dataShareConsent: false,
      dataRetentionMonths: 12,
      allowAccountDeletion: true,
      auditLogPreference: AuditLogPreference.MINIMAL,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }
}
