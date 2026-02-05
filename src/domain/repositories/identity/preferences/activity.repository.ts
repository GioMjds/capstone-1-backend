import { LoginHistoryEntryValueObject } from '@/domain/value-objects/identity/preferences/activity';
import { AuditLogEntryValueObject } from '@/domain/value-objects/identity/preferences/activity';
import { SecurityEventValueObject } from '@/domain/value-objects/identity/preferences/activity';

export interface PaginationOptions {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface DateRangeFilter {
  startDate?: Date;
  endDate?: Date;
}

export abstract class IActivityRepository {
  abstract getLoginHistory(
    userId: string,
    options?: PaginationOptions & DateRangeFilter,
  ): Promise<{ data: LoginHistoryEntryValueObject[]; total: number }>;

  abstract recordLoginAttempt(
    userId: string,
    entry: LoginHistoryEntryValueObject,
  ): Promise<void>;

  abstract getPreferenceAuditLogs(
    userId: string,
    options?: PaginationOptions & DateRangeFilter & { category?: string },
  ): Promise<{ data: AuditLogEntryValueObject[]; total: number }>;

  abstract recordPreferenceChange(
    userId: string,
    entry: AuditLogEntryValueObject,
  ): Promise<void>;

  abstract getSecurityEvents(
    userId: string,
    options?: PaginationOptions & DateRangeFilter & { eventType?: string },
  ): Promise<{ data: SecurityEventValueObject[]; total: number }>;

  abstract recordSecurityEvent(
    userId: string,
    event: SecurityEventValueObject,
  ): Promise<void>;

  abstract getAccountChangeHistory(
    userId: string,
    options?: PaginationOptions & DateRangeFilter,
  ): Promise<{ data: AuditLogEntryValueObject[]; total: number }>;

  abstract getPermissionChangeHistory(
    userId: string,
    options?: PaginationOptions & DateRangeFilter,
  ): Promise<{ data: AuditLogEntryValueObject[]; total: number }>;

  abstract getDataAccessHistory(
    userId: string,
    options?: PaginationOptions & DateRangeFilter,
  ): Promise<{ data: AuditLogEntryValueObject[]; total: number }>;

  abstract deleteActivityHistory(userId: string): Promise<void>;
}
