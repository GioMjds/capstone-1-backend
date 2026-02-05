import { ActiveSessionValueObject } from '@/domain/value-objects/identity/preferences/security';
import { TrustedDeviceValueObject } from '@/domain/value-objects/identity/preferences/security';

export abstract class ISessionRepository {
  abstract findActiveSessionsByUserId(
    userId: string,
  ): Promise<ActiveSessionValueObject[]>;

  abstract findActiveSessionById(
    userId: string,
    sessionId: string,
  ): Promise<ActiveSessionValueObject | null>;

  abstract createSession(
    userId: string,
    session: ActiveSessionValueObject,
  ): Promise<ActiveSessionValueObject>;

  abstract updateSessionLastSeen(
    userId: string,
    sessionId: string,
  ): Promise<void>;

  abstract deleteSession(userId: string, sessionId: string): Promise<void>;

  abstract deleteAllSessions(userId: string): Promise<void>;

  abstract deleteAllSessionsExcept(
    userId: string,
    currentSessionId: string,
  ): Promise<void>;

  abstract findTrustedDevicesByUserId(
    userId: string,
  ): Promise<TrustedDeviceValueObject[]>;

  abstract findTrustedDeviceById(
    userId: string,
    deviceId: string,
  ): Promise<TrustedDeviceValueObject | null>;

  abstract addTrustedDevice(
    userId: string,
    device: TrustedDeviceValueObject,
  ): Promise<TrustedDeviceValueObject>;

  abstract removeTrustedDevice(userId: string, deviceId: string): Promise<void>;

  abstract removeAllTrustedDevices(userId: string): Promise<void>;
}
