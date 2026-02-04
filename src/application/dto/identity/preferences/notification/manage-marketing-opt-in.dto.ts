import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';

export class ManageMarketingOptInDto {
  @IsBoolean()
  @ApiProperty()
  optIn: boolean;

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional()
  productUpdates?: boolean;

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional()
  promotionalOffers?: boolean;

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional()
  researchSurveys?: boolean;
}

export class ManageMarketingOptInResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  optIn: boolean;

  @ApiProperty()
  categories: Record<string, boolean>;

  @ApiProperty()
  updatedAt: Date;
}
