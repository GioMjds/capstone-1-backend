import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';

export class ManageMarketingOptInDto {
  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional({ example: true })
  emailMarketing?: boolean;

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional({ example: false })
  smsMarketing?: boolean;

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional({ example: true })
  pushMarketing?: boolean;

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional({ example: false })
  thirdPartySharing?: boolean;
}

export class MarketingOptInResponseDto {
  @ApiProperty({ example: true })
  emailMarketing: boolean;

  @ApiProperty({ example: false })
  smsMarketing: boolean;

  @ApiProperty({ example: true })
  pushMarketing: boolean;

  @ApiProperty({ example: false })
  thirdPartySharing: boolean;

  @ApiProperty()
  updatedAt: Date;
}
