import { UserEntity } from "@/domain/entities";
import { EmailValueObject } from "@/domain/value-objects";

export interface IUserRepository {
  findById(id: string): Promise<UserEntity | null>;
  findByEmail(email: EmailValueObject): Promise<UserEntity | null>;
  findAll(page: number, limit: number): Promise<UserEntity[]>;
  save(user: UserEntity): Promise<UserEntity>;
  update(user: UserEntity): Promise<UserEntity>;
  delete(id: string): Promise<void>;
  existsByEmail(email: EmailValueObject): Promise<boolean>;
  count(): Promise<number>;
  findActiveUsers(page: number, limit: number): Promise<UserEntity[]>;
}