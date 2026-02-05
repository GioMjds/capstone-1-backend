import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsArray, IsBoolean, IsIP, ArrayMinSize } from 'class-validator';

export class ConfigureIpRestrictionsDto {
  @IsBoolean()
  @ApiProperty({ example: true })
  enabled: boolean;

  @IsArray()
  @ArrayMinSize(1)
  @IsIP('4', { each: true })
  @IsOptional()
  @ApiPropertyOptional({ example: ['192.168.1.1', '10.0.0.1'] })
  allowedIps?: string[];

  @IsArray()
  @ArrayMinSize(1)
  @IsIP('4', { each: true })
  @IsOptional()
  @ApiPropertyOptional({ example: ['203.0.113.1'] })
  blockedIps?: string[];

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional({ example: false })
  blockNewCountries?: boolean;
}

export class IpRestrictionsResponseDto {
  @ApiProperty()
  enabled: boolean;

  @ApiPropertyOptional({ type: [String] })
  allowedIps?: string[];

  @ApiPropertyOptional({ type: [String] })
  blockedIps?: string[];

  @ApiProperty()
  updatedAt: Date;
}
