import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SetAccessibilityPreferencesDto {
  @IsString()
  @ApiProperty()
  fontSize: string;

  @IsString()
  @ApiProperty()
  lineHeight: string;

  @IsString()
  @ApiProperty()
  letterSpacing: string;

  @ApiProperty()
  reduceMotion?: boolean;

  @ApiProperty()
  enableFocusIndicators?: boolean;
}

export class SetAccessibilityPreferencesResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  preferences: Record<string, any>;

  @ApiProperty()
  updatedAt: Date;
}
