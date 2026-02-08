import { Injectable } from '@nestjs/common';
import { UserSecuritySettings as PrismaSecuritySettings } from '@prisma/client';

export interface SecuritySettingsDomain {
  id: string;
  twoFactorEnabled: boolean;
  twoFactorMethod: string | null;
  passwordChangedAt: Date | null;
  passkeysEnabled: boolean;
  ipRestrictions: unknown[];
  loginAlerts: Record<string, unknown>;
  suspiciousActivityAlerts: Record<string, unknown>;
  backupCodes: unknown[];
  sessionExpiration: number;
  passwordRotationReminder: number;
}

@Injectable()
export class SecurityMapper {
  toDomain(model: PrismaSecuritySettings): SecuritySettingsDomain {
    return {
      id: model.id,
      twoFactorEnabled: model.twoFactorEnabled,
      twoFactorMethod: model.twoFactorMethod,
      passwordChangedAt: model.passwordChangedAt,
      passkeysEnabled: model.passkeysEnabled,
      ipRestrictions: model.ipRestrictions as unknown[],
      loginAlerts: model.loginAlerts as Record<string, unknown>,
      suspiciousActivityAlerts: model.suspiciousActivityAlerts as Record<string, unknown>,
      backupCodes: model.backupCodes as unknown[],
      sessionExpiration: model.sessionExpiration,
      passwordRotationReminder: model.passwordRotationReminder,
    };
  }
}
