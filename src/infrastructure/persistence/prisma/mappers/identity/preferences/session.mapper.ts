import { Injectable } from '@nestjs/common';
import {
  ActiveSession as PrismaActiveSession,
  TrustedDevice as PrismaTrustedDevice,
} from '@prisma/client';
import {
  ActiveSessionValueObject,
  TrustedDeviceValueObject,
} from '@/domain/value-objects/identity/preferences/security';

@Injectable()
export class SessionMapper {
  toActiveSessionDomain(
    prismaSession: PrismaActiveSession,
  ): ActiveSessionValueObject {
    return ActiveSessionValueObject.fromPersistence({
      sessionId: prismaSession.sessionId,
      ipAddress: prismaSession.ipAddress ?? '',
      userAgent: prismaSession.userAgent ?? '',
      lastSeen: prismaSession.lastSeen.toISOString(),
      createdAt: prismaSession.createdAt.toISOString(),
    });
  }

  toActiveSessionPersistence(
    userPreferencesId: string,
    session: ActiveSessionValueObject,
  ): {
    sessionId: string;
    userPreferencesId: string;
    ipAddress: string | null;
    userAgent: string | null;
    lastSeen: Date;
  } {
    return {
      sessionId: session.getSessionId(),
      userPreferencesId,
      ipAddress: session.getIpAddress() || null,
      userAgent: session.getUserAgent() || null,
      lastSeen: session.getLastSeen(),
    };
  }

  toTrustedDeviceDomain(
    prismaDevice: PrismaTrustedDevice,
  ): TrustedDeviceValueObject {
    return TrustedDeviceValueObject.fromPersistence({
      deviceId: prismaDevice.deviceId,
      deviceName: prismaDevice.deviceName ?? 'Unknown Device',
      deviceType: 'unknown',
      lastUsed: prismaDevice.lastUsed.toISOString(),
      createdAt: prismaDevice.createdAt.toISOString(),
    });
  }

  toTrustedDevicePersistence(
    userPreferencesId: string,
    device: TrustedDeviceValueObject,
  ): {
    deviceId: string;
    userPreferencesId: string;
    deviceName: string | null;
    lastUsed: Date;
  } {
    return {
      deviceId: device.getDeviceId(),
      userPreferencesId,
      deviceName: device.getDeviceName() || null,
      lastUsed: device.getLastUsed(),
    };
  }
}
