import { Injectable } from '@nestjs/common';
import {
  PreferenceAuditLog as PrismaPreferenceAuditLog,
  SecurityAuditLog as PrismaSecurityAuditLog,
  Prisma,
} from '@prisma/client';
import { LoginStatus, AuditLogCategory, SecurityEventType } from '@/domain/interfaces';
import { AuditLogEntryValueObject, LoginHistoryEntryValueObject, SecurityEventValueObject } from '@/domain/value-objects/identity';

@Injectable()
export class ActivityMapper {
  toLoginHistoryDomain(data: Record<string, unknown>): LoginHistoryEntryValueObject {
    return LoginHistoryEntryValueObject.fromPersistence({
      ipAddress: data.ipAddress as string,
      userAgent: data.userAgent as string,
      loginTimestamp: data.loginTimestamp as string,
      status: data.status as LoginStatus,
      location: data.location as string | undefined,
      device: data.device as string | undefined,
      browser: data.browser as string | undefined,
      os: data.os as string | undefined,
    });
  }

  toLoginHistoryPersistence(entry: LoginHistoryEntryValueObject): Prisma.InputJsonValue {
    return entry.toPersistence() as Prisma.InputJsonValue;
  }

  toAuditLogDomain(prismaLog: PrismaPreferenceAuditLog): AuditLogEntryValueObject {
    return AuditLogEntryValueObject.fromPersistence({
      category: prismaLog.category as AuditLogCategory,
      field: prismaLog.field,
      oldValue: prismaLog.oldValue,
      newValue: prismaLog.newValue,
      changedBy: prismaLog.changedBy,
      changeReason: prismaLog.changeReason ?? undefined,
      timestamp: prismaLog.createdAt.toISOString(),
    });
  }

  toAuditLogPersistence(
    userPreferencesId: string,
    entry: AuditLogEntryValueObject,
  ): {
    userPreferencesId: string;
    category: string;
    field: string;
    oldValue: Prisma.InputJsonValue;
    newValue: Prisma.InputJsonValue;
    changedBy: string;
    changeReason: string | null;
  } {
    return {
      userPreferencesId,
      category: entry.getCategory(),
      field: entry.getField(),
      oldValue: entry.getOldValue() as Prisma.InputJsonValue,
      newValue: entry.getNewValue() as Prisma.InputJsonValue,
      changedBy: entry.getChangedBy(),
      changeReason: entry.getChangeReason() ?? null,
    };
  }

  toSecurityEventDomain(prismaLog: PrismaSecurityAuditLog): SecurityEventValueObject {
    return SecurityEventValueObject.fromPersistence({
      eventType: prismaLog.event as SecurityEventType,
      details: prismaLog.details as Record<string, unknown>,
      ipAddress: prismaLog.ipAddress ?? undefined,
      userAgent: prismaLog.userAgent ?? undefined,
      timestamp: prismaLog.createdAt.toISOString(),
    });
  }

  toSecurityEventPersistence(
    securitySettingsId: string,
    event: SecurityEventValueObject,
  ): {
    securitySettingsId: string;
    event: string;
    details: Prisma.InputJsonValue;
    ipAddress: string | null;
    userAgent: string | null;
  } {
    return {
      securitySettingsId,
      event: event.getEventType(),
      details: event.getDetails() as Prisma.InputJsonValue,
      ipAddress: event.getIpAddress() ?? null,
      userAgent: event.getUserAgent() ?? null,
    };
  }
}
