import { UserEntity } from "@/domain/entities";
import { EmailValueObject } from "@/domain/value-objects";

export abstract class IUserRepository {
  abstract findById(id: string): Promise<UserEntity | null>;
  abstract findByEmail(email: EmailValueObject): Promise<UserEntity | null>;
  abstract findAll(page: number, limit: number): Promise<UserEntity[]>;
  abstract save(user: UserEntity): Promise<UserEntity>;
  abstract update(user: UserEntity): Promise<UserEntity>;
  abstract delete(id: string): Promise<void>;
  abstract existsByEmail(email: EmailValueObject): Promise<boolean>;
  abstract count(): Promise<number>;
  abstract findActiveUsers(page: number, limit: number): Promise<UserEntity[]>;
  
  abstract archive(id: string, archivedAt?: Date): Promise<UserEntity>;
  abstract unarchive(id: string): Promise<UserEntity>;
  abstract findArchivedById(id: string): Promise<UserEntity | null>;
  abstract findArchivedUsers(page: number, limit: number): Promise<UserEntity[]>;
}