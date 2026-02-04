export enum AlertSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export enum MfaMethod {
  TOTP = 'totp',
  SMS = 'sms',
  EMAIL = 'email',
  BACKUP_CODES = 'backup_codes',
  PASSKEY = 'passkey',
}

export enum ActivityVisibility {
  PUBLIC = 'public',
  PRIVATE = 'private',
  FOLLOWERS = 'followers',
  ORG_ONLY = 'org_only',
}

export enum ProfileVisibility {
  PUBLIC = 'public',
  PRIVATE = 'private',
  ORG_ONLY = 'org_only',
  FRIENDS = 'friends',
}

export enum ExportFormat {
  JSON = 'json',
  CSV = 'csv',
  PDF = 'pdf',
}

export enum AuditLogFormat {
  JSON = 'json',
  CSV = 'csv',
  PDF = 'pdf',
}

export enum LoginHistorySortBy {
  DATE = 'date',
  STATUS = 'status',
  LOCATION = 'location',
}

export enum RecoveryOptionType {
  EMAIL = 'email',
  PHONE = 'phone',
  BACKUP_CODES = 'backup_codes',
  SECURITY_QUESTIONS = 'security_questions',
}

export enum TimeFormat {
  FORMAT_12H = '12h',
  FORMAT_24H = '24h',
}