import { compare, hash } from "bcrypt";

export class PasswordValueObject {
  private readonly hashedValue: string;

  private constructor(hashedValue: string) {
    this.hashedValue = hashedValue;
  }

  static async fromPlainText(plainText: string): Promise<PasswordValueObject> {
    this.validatePlainPassword(plainText);
    const hashed = await hash(plainText, 12);
    return new PasswordValueObject(hashed);
  }

  static fromHash(hashedPassword: string): PasswordValueObject {
    return new PasswordValueObject(hashedPassword);
  }

  private static validatePlainPassword(password: string): void {
    if (password.length < 8) {
      throw new Error("Password must be at least 8 characters long");
    }
    if (!/[A-Z]/.test(password)) {
      throw new Error("Password must contain at least one uppercase letter");
    }
    if (!/[a-z]/.test(password)) {
      throw new Error("Password must contain at least one lowercase letter");
    }
    if (!/[0-9]/.test(password)) {
      throw new Error("Password must contain at least one digit");
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      throw new Error("Password must contain at least one special character");
    }
  }

  async compare(plainText: string): Promise<boolean> {
    return compare(plainText, this.hashedValue);
  }

  getHashedValue(): string {
    return this.hashedValue;
  }
}