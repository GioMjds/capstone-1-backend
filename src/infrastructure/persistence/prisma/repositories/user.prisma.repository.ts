import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infrastructure/persistence';
import { IUserRepository } from '@/domain/repositories';
import { UserEntity } from '@/domain/entities/user.entity';
import { EmailValueObject } from '@/domain/value-objects';
import { UserMapper } from '@/infrastructure/persistence/prisma/mappers/user.mapper';

@Injectable()
export class PrismaUserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<UserEntity | null> {
    const prismaUser = await this.prisma.user.findUnique({
      where: { id },
      include: { isArchived: true },
    });

    return prismaUser ? UserMapper.toDomain(prismaUser) : null;
  }

  async findByEmail(email: EmailValueObject): Promise<UserEntity | null> {
    const prismaUser = await this.prisma.user.findUnique({
      where: { email: email.getValue() },
      include: { isArchived: true },
    });

    return prismaUser ? UserMapper.toDomain(prismaUser) : null;
  }

  async findAll(page: number, limit: number): Promise<UserEntity[]> {
    const skip = (page - 1) * limit;

    const prismaUsers = await this.prisma.user.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: { isArchived: true },
    });

    return prismaUsers.map((user) => UserMapper.toDomain(user));
  }

  async save(user: UserEntity): Promise<UserEntity> {
    const data = UserMapper.toPersistence(user);

    const savedUser = await this.prisma.user.create({
      data,
      include: { isArchived: true },
    });

    if (user.archivedAt) {
      await this.prisma.archivedUsers.upsert({
        where: { userId: user.id },
        update: { archivedAt: user.archivedAt },
        create: { id: user.id, userId: user.id, archivedAt: user.archivedAt },
      });
    }

    const prismaUser = await this.prisma.user.findUnique({
      where: { id: savedUser.id },
      include: { isArchived: true },
    });

    if (!prismaUser) throw new Error('User not found after creation');

    return UserMapper.toDomain(prismaUser);
  }

  async update(user: UserEntity): Promise<UserEntity> {
    const data = UserMapper.toPersistence(user);

    const updatedUser = await this.prisma.user.update({
      where: { id: user.id },
      data,
      include: { isArchived: true },
    });

    if (user.archivedAt) {
      await this.prisma.archivedUsers.upsert({
        where: { userId: user.id },
        update: { archivedAt: user.archivedAt },
        create: { id: user.id, userId: user.id, archivedAt: user.archivedAt },
      });
    } else {
      await this.prisma.archivedUsers.deleteMany({
        where: { userId: user.id },
      });
    }

    const prismaUser = await this.prisma.user.findUnique({
      where: { id: updatedUser.id },
      include: { isArchived: true },
    });

    if (!prismaUser) throw new Error('User not found after update');

    return UserMapper.toDomain(prismaUser);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.archivedUsers.deleteMany({ where: { userId: id } });
    await this.prisma.user.delete({
      where: { id },
    });
  }

  async existsByEmail(email: EmailValueObject): Promise<boolean> {
    const count = await this.prisma.user.count({
      where: { email: email.getValue() },
    });

    return count > 0;
  }

  async count(): Promise<number> {
    return this.prisma.user.count();
  }

  async findActiveUsers(page: number, limit: number): Promise<UserEntity[]> {
    const skip = (page - 1) * limit;

    const prismaUsers = await this.prisma.user.findMany({
      where: { isActive: true },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: { isArchived: true },
    });

    return prismaUsers.map((user) => UserMapper.toDomain(user));
  }

  async archive(id: string, archivedAt?: Date): Promise<UserEntity> {
    const prismaUser = await this.prisma.user.findUnique({
      where: { id },
      include: { isArchived: true },
    });

    if (!prismaUser) throw new Error('User not found');

    const at = archivedAt ?? new Date();

    await this.prisma.archivedUsers.upsert({
      where: { userId: id },
      update: { archivedAt: at },
      create: { id, userId: id, archivedAt: at },
    });

    const refreshed = await this.prisma.user.findUnique({
      where: { id },
      include: { isArchived: true },
    });

    if (!refreshed) throw new Error('User not found after archiving');

    return UserMapper.toDomain(refreshed);
  }

  async unarchive(id: string): Promise<UserEntity> {
    const prismaUser = await this.prisma.user.findUnique({
      where: { id },
      include: { isArchived: true },
    });

    if (!prismaUser) throw new Error('User not found');

    await this.prisma.archivedUsers.deleteMany({
      where: { userId: id },
    });

    await this.prisma.user.update({
      where: { id },
      data: { isActive: true },
    });

    const refreshed = await this.prisma.user.findUnique({
      where: { id },
      include: { isArchived: true },
    });

    if (!refreshed) throw new Error('User not found after unarchiving');

    return UserMapper.toDomain(refreshed);
  }

  async findArchivedById(id: string): Promise<UserEntity | null> {
    const prismaUser = await this.prisma.user.findUnique({
      where: { id },
      include: { isArchived: true },
    });

    if (!prismaUser) return null;

    const hasArchive = prismaUser.isArchived && prismaUser.isArchived.length > 0;

    return hasArchive ? UserMapper.toDomain(prismaUser) : null;
  }

  async findArchivedUsers(page: number, limit: number): Promise<UserEntity[]> {
    const skip = (page - 1) * limit;

    const prismaUsers = await this.prisma.user.findMany({
      where: { isArchived: { some: {} } },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: { isArchived: true },
    });

    return prismaUsers.map((user) => UserMapper.toDomain(user));
  }
}