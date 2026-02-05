import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsBoolean, IsOptional } from 'class-validator';

export class SetAccessibilityPreferencesDto {
  @IsString()
  @ApiProperty({ example: 'medium' })
  fontSize: string;

  @IsString()
  @ApiProperty({ example: '1.5' })
  lineHeight: string;

  @IsString()
  @ApiProperty({ example: 'normal' })
  letterSpacing: string;

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional({ example: false })
  reduceMotion?: boolean;

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional({ example: true })
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
