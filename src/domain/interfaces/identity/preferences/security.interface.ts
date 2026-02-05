export interface ISecuritySettings {
  twoFactorEnabled: boolean;
  twoFactorMethod?: 'authenticator' | 'sms' | 'email' | 'passkey';
  passkeysEnabled: boolean;
  passwordChangedAt?: Date;
  sessionTimeout: number;
  ipRestrictions: IIpRestriction;
  loginAlerts: boolean;
  suspiciousActivityAlerts: boolean;
}

export interface IIpRestriction {
  enabled: boolean;
  type: 'allowlist' | 'blocklist';
  ipAddresses: string[];
}

export interface IMfaSettings {
  enabled: boolean;
  method?: 'authenticator' | 'sms' | 'email' | 'passkey';
  backupCodesGenerated: boolean;
  lastVerified?: Date;
}

export interface IPasswordPolicy {
  rotationReminderDays: number;
  lastChanged: Date;
  requireChange: boolean;
}

export enum IpRestrictionType {
  ALLOWLIST = 'allowlist',
  BLOCKLIST = 'blocklist',
}

export enum MfaMethod {
  AUTHENTICATOR = 'authenticator',
  SMS = 'sms',
  EMAIL = 'email',
  PASSKEY = 'passkey',
}