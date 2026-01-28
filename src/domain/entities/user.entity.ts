import {
  EmailValueObject,
  PasswordValueObject,
  PhoneValueObject,
} from '@/domain/value-objects';

export class UserEntity {
  constructor(
    public readonly id: string,
    public firstName: string,
    public lastName: string,
    public email: EmailValueObject,
    private password: PasswordValueObject,
    public phone: PhoneValueObject | null = null,
    public isActive: boolean = true,
    public isEmailVerified: boolean = false,
    public readonly createdAt: Date = new Date(),
    public updatedAt: Date = new Date(),
  ) {
    this.validate();
  }

  private validate(): void {
    if (this.firstName.trim().length < 2) {
      throw new Error('First name must be at least 2 characters');
    }

    if (this.lastName.trim().length < 2) {
      throw new Error('Last name must be at least 2 characters');
    }
  }

  getFullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  isAccountActive(): boolean {
    return this.isActive && this.isEmailVerified;
  }

  canLogin(): boolean {
    return this.isActive;
  }

  activate(): void {
    if (this.isActive) {
      throw new Error('User account is already active');
    }
    this.isActive = true;
    this.updatedAt = new Date();
  }

  deactivate(reason?: string): void {
    if (!this.isActive) {
      throw new Error('User account is already inactive');
    }
    this.isActive = false;
    this.updatedAt = new Date();
  }

  verifyEmail(): void {
    if (this.isEmailVerified) {
      throw new Error('Email is already verified');
    }
    this.isEmailVerified = true;
    this.updatedAt = new Date();
  }

  async verifyPassword(plainPassword: string): Promise<boolean> {
    if (!this.canLogin()) {
      throw new Error('User account is inactive');
    }
    return this.password.compare(plainPassword);
  }

  async updatePassword(newPassword: PasswordValueObject): Promise<void> {
    this.password = newPassword;
    this.updatedAt = new Date();
  }

  updateProfile(
    firstName?: string,
    lastName?: string,
    phone?: PhoneValueObject,
  ): void {
    if (firstName) {
      if (firstName.trim().length < 2) {
        throw new Error('First name must be at least 2 characters');
      }
      this.firstName = firstName;
    }

    if (lastName) {
      if (lastName.trim().length < 2) {
        throw new Error('Last name must be at least 2 characters');
      }
      this.lastName = lastName;
    }

    if (phone !== undefined) {
      this.phone = phone;
    }

    this.updatedAt = new Date();
  }

  changeEmail(newEmail: EmailValueObject): void {
    this.email = newEmail;
    this.isEmailVerified = false;
    this.updatedAt = new Date();
  }

  getPasswordHash(): string {
    return this.password.getHashedValue();
  }
}
