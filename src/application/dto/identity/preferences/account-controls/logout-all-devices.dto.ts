import { ApiProperty } from '@nestjs/swagger';

export class LogoutAllDevicesDto {}

export class LogoutAllDevicesResponseDto {
  @ApiProperty()
  success: boolean;

  @ApiProperty()
  sessionsTerminated: number;

  @ApiProperty()
  terminatedAt: Date;
}
