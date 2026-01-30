import { User as PrismaUser } from '@prisma/client';
import { UserEntity } from '@/domain/entities/user.entity';
import {
  EmailValueObject,
  PasswordValueObject,
  PhoneValueObject,
} from '@/domain/value-objects';

export class UserMapper {
  static toDomain(prismaUser: PrismaUser): UserEntity {
    const email = new EmailValueObject(prismaUser.email);
    const password = PasswordValueObject.fromHash(prismaUser.password);
    const phone = prismaUser.phone
      ? new PhoneValueObject(prismaUser.phone)
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
