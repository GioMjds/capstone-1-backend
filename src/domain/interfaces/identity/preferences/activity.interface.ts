export interface ILoginHistoryEntry {
  id: string;
  ipAddress: string;
  userAgent: string;
  loginTimestamp: Date;
  status: 'success' | 'failed' | 'blocked' | 'suspicious';
  location?: string;
  device?: string;
  browser?: string;
  os?: string;
}

export interface IAuditLogEntry {
  id: string;
  category: string;
  field: string;
  oldValue: unknown;
  newValue: unknown;
  changedBy: string;
  changeReason?: string;
  timestamp: Date;
}

export interface ISecurityEvent {
  id: string;
  eventType: string;
  details: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  timestamp: Date;
}

export interface IActivityFilters {
  startDate?: Date;
  endDate?: Date;
  category?: string;
  eventType?: string;
}

export interface IPaginatedActivityResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export enum AuditLogCategory {
  UI = 'ui',
  NOTIFICATION = 'notification',
  SECURITY = 'security',
  COMPLIANCE = 'compliance',
  ACCOUNT = 'account',
  ACTIVITY = 'activity',
}

export enum LoginStatus {
  SUCCESS = 'success',
  FAILED = 'failed',
  BLOCKED = 'blocked',
  SUSPICIOUS = 'suspicious',
}

export enum SecurityEventType {
  LOGIN_SUCCESS = 'login_success',
  LOGIN_FAILED = 'login_failed',
  PASSWORD_CHANGED = 'password_changed',
  MFA_ENABLED = 'mfa_enabled',
  MFA_DISABLED = 'mfa_disabled',
  SESSION_REVOKED = 'session_revoked',
  DEVICE_TRUSTED = 'device_trusted',
  DEVICE_REMOVED = 'device_removed',
  SUSPICIOUS_ACTIVITY = 'suspicious_activity',
  ACCOUNT_LOCKED = 'account_locked',
  ACCOUNT_UNLOCKED = 'account_unlocked',
}

export interface CreateLoginHistoryProps {
  userId: string;
  ipAddress: string;
  userAgent: string;
  location?: string;
  device?: string;
  browser?: string;
  os?: string;
}

export enum LoginHistorySortBy {
  DATE = 'date',
  IP_ADDRESS = 'ip_address',
}

export enum AlertSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export enum AuditLogFormat {
  JSON = 'json',
  CSV = 'csv',
  PDF = 'pdf',
}