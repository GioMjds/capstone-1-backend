import { ApiProperty } from '@nestjs/swagger';

export class LogoutAllDevicesDto {}

export class LogoutAllDevicesResponseDto {
  @ApiProperty()
  message: string;

  @ApiProperty()
  sessionsTerminated: number;

  @ApiProperty()
  loggedOutAt: Date;
}
