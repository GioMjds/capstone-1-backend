export class PhoneValueObject {
  private readonly value: string;

  constructor(phone: string) {
    this.value = this.validate(phone);
  }

  private validate(phone: string): string {
    const digitsOnly = phone.replace(/\D/g, '');
    
    if (digitsOnly.length < 10 || digitsOnly.length > 15) {
      throw new Error('Phone number must be between 10 and 15 digits');
    }

    return digitsOnly;
  }

  getValue(): string {
    return this.value;
  }

  equals(other: PhoneValueObject): boolean {
    return this.value === other.getValue();
  }

  toString(): string {
    return this.value;
  }

  format(): string {
    // Format of Philippine number:
    if (this.value.startsWith('0')) {
      if (this.value.length === 11 && this.value[1] === '9') {
        return `${this.value.slice(0, 4)}-${this.value.slice(4, 7)}-${this.value.slice(7)}`;
      }
      if (this.value.length === 10) {
        return `${this.value.slice(0, 2)}-${this.value.slice(2, 6)}-${this.value.slice(6)}`;
      }
    }

    if (this.value.startsWith('63')) {
      if (this.value.length === 12 && this.value[2] === '9') {
        return `+63 ${this.value.slice(2, 5)} ${this.value.slice(5, 8)} ${this.value.slice(8)}`;
      }
      if (this.value.length === 12) {
        return `+${this.value.slice(0, 2)} ${this.value.slice(2, 6)} ${this.value.slice(6)}`;
      }
    }

    if (this.value.length === 11) {
      return `${this.value.slice(0, 4)}-${this.value.slice(4, 7)}-${this.value.slice(7)}`;
    }

    return this.value;
  }
}