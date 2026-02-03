import {
  EmailValueObject,
  PasswordValueObject,
  PhoneValueObject,
} from '@/domain/value-objects/identity';
import { Roles } from '../interfaces';
import { UserPreferencesEntity } from './user-preferences.entity';

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
    public role: Roles,
    public archivedAt: Date | null = null,
    public userPreferences: UserPreferencesEntity | null = null,
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
    return this.isActive && !this.isArchived();
  }

  isArchived(): boolean {
    return this.archivedAt !== null;
  }

  isAdmin(): boolean {
    return this.role === Roles.ADMIN;
  }

  isUser(): boolean {
    return this.role === Roles.USER;
  }

  archive(): void {
    if (this.isArchived()) throw new Error('User account is already archived');
    this.archivedAt = new Date();
    this.isActive = false;
    this.updatedAt = new Date();
  }

  unarchive(): void {
    if (!this.isArchived()) throw new Error('User account is not archived');
    this.archivedAt = null;
    this.isActive = true;
    this.updatedAt = new Date();
  }

  activate(): void {
    if (this.isActive) throw new Error('User account is already active');
    if (this.isArchived()) throw new Error('Cannot activate an archived account');
    this.isActive = true;
    this.updatedAt = new Date();
  }

  deactivate(reason?: string): void {
    if (!this.isActive) throw new Error('User account is already inactive');
    if (!reason) {
      reason = 'No reason provided';
    }
    this.isActive = false;
    this.updatedAt = new Date();
  }

  verifyEmail(): void {
    if (this.isEmailVerified) throw new Error('Email is already verified');
    this.isEmailVerified = true;
    this.updatedAt = new Date();
  }

  async verifyPassword(plainPassword: string): Promise<boolean> {
    if (!this.canLogin()) throw new Error('User account is inactive');
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

  getPreferences(): UserPreferencesEntity | null {
    return this.userPreferences;
  }

  setPreferences(prefs: UserPreferencesEntity | null): void {
    this.userPreferences = prefs;
    this.updatedAt = new Date();
  }
}
