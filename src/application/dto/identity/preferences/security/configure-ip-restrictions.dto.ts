import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsArray, IsBoolean } from 'class-validator';

export class ConfigureIpRestrictionsDto {
  @IsBoolean()
  @ApiProperty()
  enabled: boolean;

  @IsArray()
  @IsOptional()
  @ApiPropertyOptional()
  allowedIps?: string[];

  @IsArray()
  @IsOptional()
  @ApiPropertyOptional()
  blockedIps?: string[];

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional()
  blockNewCountries?: boolean;
}

export class ConfigureIpRestrictionsResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  enabled: boolean;

  @ApiProperty()
  allowedIps: string[];

  @ApiProperty()
  blockedIps: string[];

  @ApiProperty()
  blockNewCountries: boolean;

  @ApiProperty()
  updatedAt: Date;
}
