import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ActiveSessionDto {
  @ApiProperty({ example: 'session-123' })
  id: string;

  @ApiProperty({ example: 'Chrome' })
  browser: string;

  @ApiProperty({ example: 'Windows 11' })
  operatingSystem: string;

  @ApiProperty({ example: 'Desktop' })
  deviceType: string;

  @ApiProperty({ example: '192.168.1.1' })
  ipAddress: string;

  @ApiPropertyOptional({ example: 'New York, US' })
  location?: string;

  @ApiProperty()
  lastActiveAt: Date;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty({ example: true })
  isCurrent: boolean;
}

export class ActiveSessionsResponseDto {
  @ApiProperty({ type: [ActiveSessionDto] })
  sessions: ActiveSessionDto[];

  @ApiProperty({ example: 3 })
  totalCount: number;

  @ApiProperty({ example: 1 })
  currentSessionCount: number;
}
