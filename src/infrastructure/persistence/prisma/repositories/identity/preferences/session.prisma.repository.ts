import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infrastructure/persistence';
import { ISessionRepository } from '@/domain/repositories/identity/preferences';
import {
  ActiveSessionValueObject,
  TrustedDeviceValueObject,
} from '@/domain/value-objects/identity/preferences/security';
import { SessionMapper } from '@/infrastructure/persistence/prisma/mappers/identity/preferences';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class PrismaSessionRepository implements ISessionRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mapper: SessionMapper,
  ) {}

  private async getUserPreferencesId(userId: string): Promise<string | null> {
    const preferences = await this.prisma.userPreferences.findUnique({
      where: { userId },
      select: { id: true },
    });
    return preferences?.id ?? null;
  }

  async findActiveSessionsByUserId(userId: string): Promise<ActiveSessionValueObject[]> {
    const preferencesId = await this.getUserPreferencesId(userId);
    if (!preferencesId) return [];

    const sessions = await this.prisma.activeSession.findMany({
      where: { userPreferencesId: preferencesId },
      orderBy: { lastSeen: 'desc' },
    });

    return sessions.map((s) => this.mapper.toActiveSessionDomain(s));
  }

  async findActiveSessionById(
    userId: string,
    sessionId: string,
  ): Promise<ActiveSessionValueObject | null> {
    const preferencesId = await this.getUserPreferencesId(userId);
    if (!preferencesId) return null;

    const session = await this.prisma.activeSession.findFirst({
      where: {
        userPreferencesId: preferencesId,
        sessionId,
      },
    });

    return session ? this.mapper.toActiveSessionDomain(session) : null;
  }

  async createSession(
    userId: string,
    session: ActiveSessionValueObject,
  ): Promise<ActiveSessionValueObject> {
    const preferencesId = await this.getUserPreferencesId(userId);
    if (!preferencesId) {
      throw new Error('User preferences not found');
    }

    const data = this.mapper.toActiveSessionPersistence(preferencesId, session);

    const created = await this.prisma.activeSession.create({
      data: {
        id: uuidv4().slice(0, 12),
        ...data,
      },
    });

    return this.mapper.toActiveSessionDomain(created);
  }

  async updateSessionLastSeen(userId: string, sessionId: string): Promise<void> {
    const preferencesId = await this.getUserPreferencesId(userId);
    if (!preferencesId) return;

    await this.prisma.activeSession.updateMany({
      where: {
        userPreferencesId: preferencesId,
        sessionId,
      },
      data: { lastSeen: new Date() },
    });
  }

  async deleteSession(userId: string, sessionId: string): Promise<void> {
    const preferencesId = await this.getUserPreferencesId(userId);
    if (!preferencesId) return;

    await this.prisma.activeSession.deleteMany({
      where: {
        userPreferencesId: preferencesId,
        sessionId,
      },
    });
  }

  async deleteAllSessions(userId: string): Promise<void> {
    const preferencesId = await this.getUserPreferencesId(userId);
    if (!preferencesId) return;

    await this.prisma.activeSession.deleteMany({
      where: { userPreferencesId: preferencesId },
    });
  }

  async deleteAllSessionsExcept(userId: string, currentSessionId: string): Promise<void> {
    const preferencesId = await this.getUserPreferencesId(userId);
    if (!preferencesId) return;

    await this.prisma.activeSession.deleteMany({
      where: {
        userPreferencesId: preferencesId,
        NOT: { sessionId: currentSessionId },
      },
    });
  }

  async findTrustedDevicesByUserId(userId: string): Promise<TrustedDeviceValueObject[]> {
    const preferencesId = await this.getUserPreferencesId(userId);
    if (!preferencesId) return [];

    const devices = await this.prisma.trustedDevice.findMany({
      where: { userPreferencesId: preferencesId },
      orderBy: { lastUsed: 'desc' },
    });

    return devices.map((d) => this.mapper.toTrustedDeviceDomain(d));
  }

  async findTrustedDeviceById(
    userId: string,
    deviceId: string,
  ): Promise<TrustedDeviceValueObject | null> {
    const preferencesId = await this.getUserPreferencesId(userId);
    if (!preferencesId) return null;

    const device = await this.prisma.trustedDevice.findFirst({
      where: {
        userPreferencesId: preferencesId,
        deviceId,
      },
    });

    return device ? this.mapper.toTrustedDeviceDomain(device) : null;
  }

  async addTrustedDevice(
    userId: string,
    device: TrustedDeviceValueObject,
  ): Promise<TrustedDeviceValueObject> {
    const preferencesId = await this.getUserPreferencesId(userId);
    if (!preferencesId) {
      throw new Error('User preferences not found');
    }

    const data = this.mapper.toTrustedDevicePersistence(preferencesId, device);

    const created = await this.prisma.trustedDevice.create({
      data: {
        id: uuidv4().slice(0, 12),
        ...data,
      },
    });

    return this.mapper.toTrustedDeviceDomain(created);
  }

  async removeTrustedDevice(userId: string, deviceId: string): Promise<void> {
    const preferencesId = await this.getUserPreferencesId(userId);
    if (!preferencesId) return;

    await this.prisma.trustedDevice.deleteMany({
      where: {
        userPreferencesId: preferencesId,
        deviceId,
      },
    });
  }

  async removeAllTrustedDevices(userId: string): Promise<void> {
    const preferencesId = await this.getUserPreferencesId(userId);
    if (!preferencesId) return;

    await this.prisma.trustedDevice.deleteMany({
      where: { userPreferencesId: preferencesId },
    });
  }
}
