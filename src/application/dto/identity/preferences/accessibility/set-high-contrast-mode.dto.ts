import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class SetHighContrastModeDto {
  @IsBoolean()
  @ApiProperty()
  enabled: boolean;
}

export class SetHighContrastModeResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  enabled: boolean;

  @ApiProperty()
  theme: string;

  @ApiProperty()
  updatedAt: Date;
}
