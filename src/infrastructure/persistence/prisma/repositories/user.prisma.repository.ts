import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infrastructure/persistence';
import { IUserRepository } from '@/domain/repositories';
import { UserEntity } from '@/domain/entities/user.entity';
import { EmailValueObject } from '@/domain/value-objects';
import { UserMapper } from '@/infrastructure/persistence/prisma/mappers';

@Injectable()
export class PrismaUserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<UserEntity | null> {
    const prismaUser = await this.prisma.user.findUnique({
      where: { id },
    });

    return prismaUser ? UserMapper.toDomain(prismaUser) : null;
  }

  async findByEmail(email: EmailValueObject): Promise<UserEntity | null> {
    const prismaUser = await this.prisma.user.findUnique({
      where: { email: email.getValue() },
    });

    return prismaUser ? UserMapper.toDomain(prismaUser) : null;
  }

  async findAll(page: number, limit: number): Promise<UserEntity[]> {
    const skip = (page - 1) * limit;

    const prismaUsers = await this.prisma.user.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });

    return prismaUsers.map((user) => UserMapper.toDomain(user));
  }

  async save(user: UserEntity): Promise<UserEntity> {
    const data = UserMapper.toPersistence(user);

    const savedUser = await this.prisma.user.create({ data });

    return UserMapper.toDomain(savedUser);
  }

  async update(user: UserEntity): Promise<UserEntity> {
    const data = UserMapper.toPersistence(user);

    const updatedUser = await this.prisma.user.update({
      where: { id: user.id },
      data,
    });

    return UserMapper.toDomain(updatedUser);
  }

  async delete(id: string): Promise<void> {
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
    });

    return prismaUsers.map((user) => UserMapper.toDomain(user));
  }
}