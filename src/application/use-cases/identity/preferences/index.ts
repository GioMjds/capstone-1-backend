export * from './accessibility';
export * from './account-controls';
export * from './activity';
export * from './customizations';
export * from './data-ownership';
export * from './notification';
export * from './privacy';
export * from './security';

import {
  AccountDeactivationUseCase,
  AccountDeletionUseCase,
  AccountRecoveryUseCase,
  GetUiPreferencesUseCase,
  UpdateUiPreferencesUseCase,
  ChangeEmailUseCase,
  ChangeUsernameUseCase,
  LogoutAllDevicesUseCase,
  ManageRecoveryOptionsUseCase,
} from './account-controls';

import {
  GetPreferenceAuditLogsUseCase,
  ViewActiveSessionsUseCase,
  GetLoginHistoryUseCase,
  GetSecurityEventsUseCase,
  GetAccountChangeHistoryUseCase,
  GetPermissionChangeHistoryUseCase,
  ExportAuditLogsUseCase,
  GetDataAccessHistoryUseCase,
} from './activity';

import {
  GetNotificationSettingsUseCase,
  UpdateNotificationSettingsUseCase,
  SetQuietHoursUseCase,
  ManageMarketingOptInUseCase,
  ConfigureEmailNotificationsByCategoryUseCase,
  ConfigurePushNotificationsByCategoryUseCase,
  ConfigureSmsAlertsUseCase,
} from './notification';

import {
  GetComplianceSettingsUseCase,
  UpdateComplianceSettingsUseCase,
  GetProfileVisibilityUseCase,
  UpdateProfileVisibilityUseCase,
  GetActivityVisibilityUseCase,
  UpdateActivityVisibilityUseCase,
  GetOnlinePresenceSettingsUseCase,
  UpdateOnlinePresenceSettingsUseCase,
  GetFieldLevelVisibilityUseCase,
  UpdateFieldLevelVisibilityUseCase,
} from './privacy';

import {
  GetSecuritySettingsUseCase,
  MultiFactorAuthUseCase,
  UpdateSecuritySettingsUseCase,
  SelectMfaMethodUseCase,
  RegenerateBackupCodesUseCase,
  ManageTrustedDevicesUseCase,
  ConfigureLoginAlertsUseCase,
  ConfigureSuspiciousActivityAlertsUseCase,
  SetPasswordRotationReminderUseCase,
  SetSessionExpirationUseCase,
  ConfigureIpRestrictionsUseCase,
} from './security';

import {
  SetLanguageUseCase,
  SetTimezoneUseCase,
  SetDateNumberFormatsUseCase,
  SetCurrencyUseCase,
  SetTimeFormatUseCase,
  SetAccessibilityPreferencesUseCase,
  SetHighContrastModeUseCase,
} from './accessibility';

import {
  SetThemeUseCase,
  SetLayoutPreferencesUseCase,
  SetDefaultViewsUseCase,
  SetSortFilterDefaultsUseCase,
  SetPaginationSizeUseCase,
  ManageFeatureTogglesUseCase,
  ManageBetaFeaturesOptInUseCase,
  ManageAiFeaturesOptInUseCase,
  SetContentSensitivityFiltersUseCase,
} from './customizations';

import {
  ExportPersonalDataUseCase,
  ExportActivityHistoryUseCase,
  DownloadAccountArchiveUseCase,
  RequestDataDeletionUseCase,
  RequestDataCorrectionUseCase,
  AnonymizeDataUseCase,
  SetExportFormatUseCase,
} from './data-ownership';

export const USER_PREFERENCES_USE_CASES = [
  AccountDeactivationUseCase,
  AccountDeletionUseCase,
  AccountRecoveryUseCase,
  ChangeEmailUseCase,
  ChangeUsernameUseCase,
  LogoutAllDevicesUseCase,
  ManageRecoveryOptionsUseCase,

  GetPreferenceAuditLogsUseCase,
  ViewActiveSessionsUseCase,
  GetLoginHistoryUseCase,
  GetSecurityEventsUseCase,
  GetAccountChangeHistoryUseCase,
  GetPermissionChangeHistoryUseCase,
  ExportAuditLogsUseCase,
  GetDataAccessHistoryUseCase,

  GetNotificationSettingsUseCase,
  UpdateNotificationSettingsUseCase,
  SetQuietHoursUseCase,
  ManageMarketingOptInUseCase,
  ConfigureEmailNotificationsByCategoryUseCase,
  ConfigurePushNotificationsByCategoryUseCase,
  ConfigureSmsAlertsUseCase,

  GetComplianceSettingsUseCase,
  UpdateComplianceSettingsUseCase,
  GetProfileVisibilityUseCase,
  UpdateProfileVisibilityUseCase,
  GetActivityVisibilityUseCase,
  UpdateActivityVisibilityUseCase,
  GetOnlinePresenceSettingsUseCase,
  UpdateOnlinePresenceSettingsUseCase,
  GetFieldLevelVisibilityUseCase,
  UpdateFieldLevelVisibilityUseCase,

  GetSecuritySettingsUseCase,
  MultiFactorAuthUseCase,
  UpdateSecuritySettingsUseCase,
  SelectMfaMethodUseCase,
  RegenerateBackupCodesUseCase,
  ManageTrustedDevicesUseCase,
  ConfigureLoginAlertsUseCase,
  ConfigureSuspiciousActivityAlertsUseCase,
  SetPasswordRotationReminderUseCase,
  SetSessionExpirationUseCase,
  ConfigureIpRestrictionsUseCase,

  SetLanguageUseCase,
  SetTimezoneUseCase,
  SetDateNumberFormatsUseCase,
  SetCurrencyUseCase,
  SetTimeFormatUseCase,
  SetAccessibilityPreferencesUseCase,
  SetHighContrastModeUseCase,

  SetThemeUseCase,
  SetLayoutPreferencesUseCase,
  SetDefaultViewsUseCase,
  SetSortFilterDefaultsUseCase,
  SetPaginationSizeUseCase,
  ManageFeatureTogglesUseCase,
  ManageBetaFeaturesOptInUseCase,
  ManageAiFeaturesOptInUseCase,
  SetContentSensitivityFiltersUseCase,

  ExportPersonalDataUseCase,
  ExportActivityHistoryUseCase,
  DownloadAccountArchiveUseCase,
  RequestDataDeletionUseCase,
  RequestDataCorrectionUseCase,
  AnonymizeDataUseCase,
  SetExportFormatUseCase,

  UpdateUiPreferencesUseCase,
  GetUiPreferencesUseCase,
];
