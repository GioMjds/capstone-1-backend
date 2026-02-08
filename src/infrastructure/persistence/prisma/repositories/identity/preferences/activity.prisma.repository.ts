import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infrastructure/persistence';
import {
  IActivityRepository,
  PaginationOptions,
  DateRangeFilter,
} from '@/domain/repositories/identity/preferences';
import {
  LoginHistoryEntryValueObject,
  AuditLogEntryValueObject,
  SecurityEventValueObject,
} from '@/domain/value-objects/identity/preferences/activity';
import { ActivityMapper } from '@/infrastructure/persistence/prisma/mappers/identity/preferences';
import { AuditLogCategory } from '@/domain/interfaces';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class PrismaActivityRepository implements IActivityRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mapper: ActivityMapper,
  ) {}

  private async getUserPreferencesId(userId: string): Promise<string | null> {
    const preferences = await this.prisma.userPreferences.findUnique({
      where: { userId },
      select: { id: true },
    });
    return preferences?.id ?? null;
  }

  private async getSecuritySettingsId(userId: string): Promise<string | null> {
    const preferences = await this.prisma.userPreferences.findUnique({
      where: { userId },
      include: { securitySettings: { select: { id: true } } },
    });
    return preferences?.securitySettings?.id ?? null;
  }

  async getLoginHistory(
    userId: string,
    options?: PaginationOptions & DateRangeFilter,
  ): Promise<{ data: LoginHistoryEntryValueObject[]; total: number }> {
    const securitySettingsId = await this.getSecuritySettingsId(userId);
    if (!securitySettingsId) return { data: [], total: 0 };

    const where: Record<string, unknown> = {
      securitySettingsId,
      event: 'login_attempt',
    };

    if (options?.startDate || options?.endDate) {
      where.createdAt = {};
      if (options.startDate)
        (where.createdAt as Record<string, Date>).gte = options.startDate;
      if (options.endDate)
        (where.createdAt as Record<string, Date>).lte = options.endDate;
    }

    const [logs, total] = await Promise.all([
      this.prisma.securityAuditLog.findMany({
        where,
        skip: options ? (options.page - 1) * options.limit : 0,
        take: options?.limit ?? 20,
        orderBy: { createdAt: options?.sortOrder ?? 'desc' },
      }),
      this.prisma.securityAuditLog.count({ where }),
    ]);

    const data = logs.map((log) =>
      this.mapper.toLoginHistoryDomain({
        ipAddress: log.ipAddress ?? '',
        userAgent: log.userAgent ?? '',
        loginTimestamp: log.createdAt.toISOString(),
        status: (log.details as Record<string, unknown>)?.status ?? 'success',
        location: (log.details as Record<string, unknown>)?.location as
          | string
          | undefined,
        device: (log.details as Record<string, unknown>)?.device as
          | string
          | undefined,
      }),
    );

    return { data, total };
  }

  async recordLoginAttempt(
    userId: string,
    entry: LoginHistoryEntryValueObject,
  ): Promise<void> {
    const securitySettingsId = await this.getSecuritySettingsId(userId);
    if (!securitySettingsId) return;

    await this.prisma.securityAuditLog.create({
      data: {
        id: uuidv4().slice(0, 12),
        securitySettingsId,
        event: 'login_attempt',
        details: this.mapper.toLoginHistoryPersistence(entry),
        ipAddress: entry.getIpAddress(),
        userAgent: entry.getUserAgent(),
      },
    });
  }

  async getPreferenceAuditLogs(
    userId: string,
    options?: PaginationOptions & DateRangeFilter & { category?: string },
  ): Promise<{ data: AuditLogEntryValueObject[]; total: number }> {
    const preferencesId = await this.getUserPreferencesId(userId);
    if (!preferencesId) return { data: [], total: 0 };

    const where: Record<string, unknown> = { userPreferencesId: preferencesId };

    if (options?.category) where.category = options.category;
    if (options?.startDate || options?.endDate) {
      where.createdAt = {};
      if (options.startDate)
        (where.createdAt as Record<string, Date>).gte = options.startDate;
      if (options.endDate)
        (where.createdAt as Record<string, Date>).lte = options.endDate;
    }

    const [logs, total] = await Promise.all([
      this.prisma.preferenceAuditLog.findMany({
        where,
        skip: options ? (options.page - 1) * options.limit : 0,
        take: options?.limit ?? 20,
        orderBy: { createdAt: options?.sortOrder ?? 'desc' },
      }),
      this.prisma.preferenceAuditLog.count({ where }),
    ]);

    return {
      data: logs.map((log) => this.mapper.toAuditLogDomain(log)),
      total,
    };
  }

  async recordPreferenceChange(
    userId: string,
    entry: AuditLogEntryValueObject,
  ): Promise<void> {
    const preferencesId = await this.getUserPreferencesId(userId);
    if (!preferencesId) return;

    const data = this.mapper.toAuditLogPersistence(preferencesId, entry);

    await this.prisma.preferenceAuditLog.create({
      data: {
        id: uuidv4().slice(0, 12),
        ...data,
      },
    });
  }

  async getSecurityEvents(
    userId: string,
    options?: PaginationOptions & DateRangeFilter & { eventType?: string },
  ): Promise<{ data: SecurityEventValueObject[]; total: number }> {
    const securitySettingsId = await this.getSecuritySettingsId(userId);
    if (!securitySettingsId) return { data: [], total: 0 };

    const where: Record<string, unknown> = { securitySettingsId };

    if (options?.eventType) where.event = options.eventType;
    if (options?.startDate || options?.endDate) {
      where.createdAt = {};
      if (options.startDate)
        (where.createdAt as Record<string, Date>).gte = options.startDate;
      if (options.endDate)
        (where.createdAt as Record<string, Date>).lte = options.endDate;
    }

    const [logs, total] = await Promise.all([
      this.prisma.securityAuditLog.findMany({
        where,
        skip: options ? (options.page - 1) * options.limit : 0,
        take: options?.limit ?? 20,
        orderBy: { createdAt: options?.sortOrder ?? 'desc' },
      }),
      this.prisma.securityAuditLog.count({ where }),
    ]);

    return {
      data: logs.map((log) => this.mapper.toSecurityEventDomain(log)),
      total,
    };
  }

  async recordSecurityEvent(
    userId: string,
    event: SecurityEventValueObject,
  ): Promise<void> {
    const securitySettingsId = await this.getSecuritySettingsId(userId);
    if (!securitySettingsId) return;

    const data = this.mapper.toSecurityEventPersistence(
      securitySettingsId,
      event,
    );

    await this.prisma.securityAuditLog.create({
      data: {
        id: uuidv4().slice(0, 12),
        ...data,
      },
    });
  }

  async getAccountChangeHistory(
    userId: string,
    options?: PaginationOptions & DateRangeFilter,
  ): Promise<{ data: AuditLogEntryValueObject[]; total: number }> {
    return this.getPreferenceAuditLogs(userId, {
      ...options,
      page: options?.page ?? 1,
      limit: options?.limit ?? 20,
      category: AuditLogCategory.ACCOUNT,
    });
  }

  async getPermissionChangeHistory(
    userId: string,
    options?: PaginationOptions & DateRangeFilter,
  ): Promise<{ data: AuditLogEntryValueObject[]; total: number }> {
    return this.getPreferenceAuditLogs(userId, {
      ...options,
      page: options?.page ?? 1,
      limit: options?.limit ?? 20,
      category: AuditLogCategory.SECURITY,
    });
  }

  async getDataAccessHistory(
    userId: string,
    options?: PaginationOptions & DateRangeFilter,
  ): Promise<{ data: AuditLogEntryValueObject[]; total: number }> {
    return this.getPreferenceAuditLogs(userId, {
      ...options,
      page: options?.page ?? 1,
      limit: options?.limit ?? 20,
      category: AuditLogCategory.COMPLIANCE,
    });
  }

  async deleteActivityHistory(userId: string): Promise<void> {
    const preferencesId = await this.getUserPreferencesId(userId);
    const securitySettingsId = await this.getSecuritySettingsId(userId);

    if (preferencesId) {
      await this.prisma.preferenceAuditLog.deleteMany({
        where: { userPreferencesId: preferencesId },
      });
    }

    if (securitySettingsId) {
      await this.prisma.securityAuditLog.deleteMany({
        where: { securitySettingsId },
      });
    }
  }
}
