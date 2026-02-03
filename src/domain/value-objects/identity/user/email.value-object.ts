export class EmailValueObject {
  private readonly value: string;

  constructor(private readonly email: string) {
    this.value = this.validate(email);
  }

  private validate(email: string): string {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Invalid email format');
    }
    return email.toLowerCase().trim();
  }

  getValue(): string {
    return this.value;
  }

  equals(other: EmailValueObject): boolean {
    return this.value === other.getValue();
  }

  toString(): string {
    return this.value;
  }

  getDomain(): string {
    return this.value.split('@')[1];
  }

  getLocalPart(): string {
    return this.value.split('@')[0];
  }
}