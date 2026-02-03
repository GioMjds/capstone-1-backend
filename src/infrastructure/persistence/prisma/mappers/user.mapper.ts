import {
  User as PrismaUser,
  ArchivedUsers as PrismaArchivedUsers,
  UserPreferences as PrismaUserPreferences,
} from '@prisma/client';
import { UserEntity } from '@/domain/entities/user.entity';
import { UserPreferencesEntity } from '@/domain/entities/user-preferences.entity';
import {
  EmailValueObject,
  PasswordValueObject,
  PhoneValueObject,
} from '@/domain/value-objects/identity';
import { Roles } from '@/domain/interfaces';

export class UserMapper {
  static toDomain(
    prismaUser: PrismaUser & {
      isArchived: PrismaArchivedUsers[];
      userPreferences: PrismaUserPreferences[] | null;
    },
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

    const role = prismaUser.role as Roles;

    const preferences = prismaUser.userPreferences && prismaUser.userPreferences.length
      ? (() => {
          const up = prismaUser.userPreferences[0];
          const ui: any = up.uiPreferences ?? {};
          const ns: any = up.notificationSettings ?? {};

          return UserPreferencesEntity.reconstitute({
            id: up.id,
            userId: up.userId,
            theme: ui.theme ?? ns.theme ?? 'LIGHT',
            language: ui.language ?? ns.language ?? 'en',
            notifications: typeof ns.notifications === 'boolean' ? ns.notifications : (ui.notifications ?? true),
          });
        })()
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
      role,
      archivedAt,
      preferences,
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
      phone: user.phone ? user.phone.getValue() : null,
      isActive: user.isActive,
      isEmailVerified: user.isEmailVerified,
      role: user.role,
    };
  }
}