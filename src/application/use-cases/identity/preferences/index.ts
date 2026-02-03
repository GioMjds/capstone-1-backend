export * from './update-ui-preferences.use-case';
export * from './update-notification-settings.use-case';
export * from './update-security-settings.use-case';
export * from './update-compliance-settings.use-case';
export * from './get-preference-audit-logs.use-case';
export * from './get-ui-preferences.use-case';
export * from './get-notification-settings.use-case';
export * from './get-security-settings.use-case';
export * from './get-compliance-settings.use-case';

import { UpdateComplianceSettingsUseCase } from './update-compliance-settings.use-case';
import { UpdateNotificationSettingsUseCase } from './update-notification-settings.use-case';
import { UpdateSecuritySettingsUseCase } from './update-security-settings.use-case';
import { UpdateUiPreferencesUseCase } from './update-ui-preferences.use-case';
import { GetPreferenceAuditLogsUseCase } from './get-preference-audit-logs.use-case';
import { GetUiPreferencesUseCase } from './get-ui-preferences.use-case';
import { GetNotificationSettingsUseCase } from './get-notification-settings.use-case';
import { GetSecuritySettingsUseCase } from './get-security-settings.use-case';
import { GetComplianceSettingsUseCase } from './get-compliance-settings.use-case';

export const USER_PREFERENCES_USE_CASES = [
  UpdateUiPreferencesUseCase,
  UpdateNotificationSettingsUseCase,
  UpdateSecuritySettingsUseCase,
  UpdateComplianceSettingsUseCase,
  GetPreferenceAuditLogsUseCase,
  GetUiPreferencesUseCase,
  GetNotificationSettingsUseCase,
  GetSecuritySettingsUseCase,
  GetComplianceSettingsUseCase,
];