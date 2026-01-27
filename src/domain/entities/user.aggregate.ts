import { User as PrismaUser } from "@prisma/client";

export class UserAggregate {
  constructor(
    public id: string,
    public firstName: string,
    public lastName: string,
    public email: string,
    private password: string,
    public isEmailVerified: boolean = false,
  ) {}

  static fromPrisma(user: PrismaUser) {
    return new UserAggregate(
      user.id,
      user.firstName,
      user.lastName,
      user.email,
      user.password,
      user.isEmailVerified,
    );
  }

  toPrismaCreate() {
    return {
      id: this.id,
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      password: this.password,
      isEmailVerified: this.isEmailVerified,
    } as Omit<PrismaUser, "createdAt" | "updatedAt">;
  }

  verifyEmail() {
    if (this.isEmailVerified) return;
    this.isEmailVerified = true;
  }

  setPassword(hash: string) {
    this.password = hash;
  }
}