import {
  User as PrismaUser,
  ArchivedUsers as PrismaArchivedUsers,
} from '@prisma/client';
import { UserEntity } from '@/domain/entities/user.entity';
import {
  EmailValueObject,
  PasswordValueObject,
  PhoneValueObject,
} from '@/domain/value-objects';

export class UserMapper {
  static toDomain(
    prismaUser: PrismaUser & { isArchived: PrismaArchivedUsers[] },
  ): UserEntity {
    const email = new EmailValueObject(prismaUser.email);
    const password = PasswordValueObject.fromHash(prismaUser.password);
    const phone = prismaUser.phone
      ? new PhoneValueObject(prismaUser.phone)
      : null;

    const archivedAt =
      prismaUser.isArchived && prismaUser.isArchived.length
        ? prismaUser.isArchived[0].archivedAt
        : null;

    return new UserEntity(
      prismaUser.id,
      prismaUser.firstName,
      prismaUser.lastName,
      email,
      password,
      phone,
      prismaUser.isActive,
      prismaUser.isEmailVerified,
      archivedAt,
      prismaUser.createdAt,
      prismaUser.updatedAt,
    );
  }

  static toPersistence(
    user: UserEntity,
  ): Omit<PrismaUser, 'createdAt' | 'updatedAt'> {
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email.getValue(),
      password: user.getPasswordHash(),
      phone: user.phone?.getValue() || null,
      isActive: user.isActive,
      isEmailVerified: user.isEmailVerified,
    };
  }
}
