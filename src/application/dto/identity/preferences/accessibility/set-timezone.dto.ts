import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SetTimezoneDto {
  @IsString()
  @ApiProperty({ example: 'America/New_York' })
  timezone: string;
}

export class SetTimezoneResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  timezone: string;

  @ApiProperty()
  utcOffset: string;

  @ApiProperty()
  updatedAt: Date;
}
