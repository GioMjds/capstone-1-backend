import { Injectable } from '@nestjs/common';
import { RedisService } from '@/configs';

const OTP_LENGTH = 6;
const OTP_TTL_SECONDS = 600;

@Injectable()
export class OtpService {
  constructor(private redis: RedisService) {}

  generate(): string {
    const digits = '0123456789';
    let otp = '';
    for (let i = 0; i < OTP_LENGTH; i++) {
      otp += digits[Math.floor(Math.random() * digits.length)];
    }
    return otp;
  }

  private getKey(email: string): string {
    return `otp:${email.toLowerCase()}`;
  }

  async store(email: string, otp: string): Promise<void> {
    const key = this.getKey(email);
    await this.redis.set(key, otp, OTP_TTL_SECONDS);
  }

  async verify(email: string, otp: string): Promise<boolean> {
    const key = this.getKey(email);
    const storedOtp = await this.redis.get(key);
    return storedOtp === otp;
  }

  async invalidate(email: string): Promise<void> {
    const key = this.getKey(email);
    await this.redis.del(key);
  }

  async exists(email: string): Promise<boolean> {
    const key = this.getKey(email);
    return this.redis.exists(key);
  }
}
