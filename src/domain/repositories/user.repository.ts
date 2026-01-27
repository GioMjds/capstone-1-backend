import { User } from "@prisma/client";

export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(data: Omit<User, "createdAt" | "updatedAt">): Promise<User>;
  update(id: string, data: Omit<User, "createdAt" | "updatedAt">): Promise<User>;
  delete(id: string): Promise<void>;
}