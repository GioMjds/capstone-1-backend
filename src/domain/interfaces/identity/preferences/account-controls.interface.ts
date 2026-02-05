export enum AccountState {
  ACTIVE = 'active',
  DEACTIVATED = 'deactivated',
  DELETION_REQUESTED = 'deletion_requested',
  SUSPENDED = 'suspended',
}

export enum Theme {
  LIGHT = 'light',
  DARK = 'dark',
  SYSTEM = 'system',
}

export interface UserPreferencesProps {
  theme?: Theme;
  language?: string;
  notifications?: boolean;
}

export enum RecoveryMethod {
  EMAIL = 'email',
  PHONE = 'phone',
  BACKUP_CODES = 'backup_codes',
  SECURITY_QUESTIONS = 'security_questions',
}

export enum RecoveryOptionType {
  EMAIL = 'email',
  PHONE = 'phone',
  BACKUP_CODES = 'backup_codes',
  SECURITY_QUESTIONS = 'security_questions',
}