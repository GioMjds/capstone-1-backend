export abstract class ISecurityRepository {
  abstract getSecuritySettings(userId: string): Promise<{
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
  } | null>;

  abstract updateSecuritySettings(
    userId: string,
    settings: Partial<{
      twoFactorEnabled: boolean;
      twoFactorMethod: string | null;
      passkeysEnabled: boolean;
      ipRestrictions: unknown[];
      loginAlerts: Record<string, unknown>;
      suspiciousActivityAlerts: Record<string, unknown>;
      backupCodes: unknown[];
      sessionExpiration: number;
      passwordRotationReminder: number;
    }>,
  ): Promise<void>;

  abstract enableMfa(
    userId: string,
    method: string,
  ): Promise<void>;

  abstract disableMfa(userId: string): Promise<void>;

  abstract regenerateBackupCodes(userId: string): Promise<string[]>;
}
