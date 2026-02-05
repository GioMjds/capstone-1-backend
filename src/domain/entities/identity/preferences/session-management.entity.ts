import { v4 as uuidv4 } from 'uuid';
import {
  ActiveSessionValueObject,
  TrustedDeviceValueObject,
} from '@/domain/value-objects/identity/preferences/security';

export class SessionManagementEntity {
  private constructor(
    public readonly id: string,
    public readonly userId: string,
    private activeSessions: ActiveSessionValueObject[],
    private trustedDevices: TrustedDeviceValueObject[],
  ) {}

  static create(userId: string): SessionManagementEntity {
    return new SessionManagementEntity(uuidv4().slice(0, 12), userId, [], []);
  }

  static reconstitute(payload: {
    id: string;
    userId: string;
    activeSessions: ActiveSessionValueObject[];
    trustedDevices: TrustedDeviceValueObject[];
  }): SessionManagementEntity {
    return new SessionManagementEntity(
      payload.id,
      payload.userId,
      payload.activeSessions,
      payload.trustedDevices,
    );
  }

  addActiveSession(session: ActiveSessionValueObject): void {
    this.activeSessions.push(session);
  }

  removeActiveSession(sessionId: string): void {
    this.activeSessions = this.activeSessions.filter(
      (s) => s.getSessionId() !== sessionId,
    );
  }

  removeAllSessionsExcept(currentSessionId: string): void {
    this.activeSessions = this.activeSessions.filter(
      (s) => s.getSessionId() === currentSessionId,
    );
  }

  clearAllSessions(): void {
    this.activeSessions = [];
  }

  addTrustedDevice(device: TrustedDeviceValueObject): void {
    this.trustedDevices.push(device);
  }

  removeTrustedDevice(deviceId: string): void {
    this.trustedDevices = this.trustedDevices.filter(
      (d) => d.getDeviceId() !== deviceId,
    );
  }

  clearAllTrustedDevices(): void {
    this.trustedDevices = [];
  }

  getActiveSessions(): readonly ActiveSessionValueObject[] {
    return Object.freeze([...this.activeSessions]);
  }

  getTrustedDevices(): readonly TrustedDeviceValueObject[] {
    return Object.freeze([...this.trustedDevices]);
  }

  getActiveSessionCount(): number {
    return this.activeSessions.length;
  }

  getTrustedDeviceCount(): number {
    return this.trustedDevices.length;
  }

  hasActiveSession(sessionId: string): boolean {
    return this.activeSessions.some((s) => s.getSessionId() === sessionId);
  }

  hasTrustedDevice(deviceId: string): boolean {
    return this.trustedDevices.some((d) => d.getDeviceId() === deviceId);
  }
}