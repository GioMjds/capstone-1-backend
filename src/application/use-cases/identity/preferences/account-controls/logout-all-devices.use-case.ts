import { Injectable } from '@nestjs/common';
import { LogoutAllDevicesResponseDto } from '@/application/dto/identity/preferences';

@Injectable()
export class LogoutAllDevicesUseCase {
  constructor() {}

  async execute(): Promise<LogoutAllDevicesResponseDto> {
    return {
      success: true,
      sessionsTerminated: 0,
      terminatedAt: new Date(),
    };
  }
}
