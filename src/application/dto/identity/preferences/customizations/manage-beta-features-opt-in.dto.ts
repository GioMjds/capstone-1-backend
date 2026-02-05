import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsOptional, IsString } from 'class-validator';

export class ManageBetaFeaturesDto {
  @IsBoolean()
  @ApiProperty({ example: true })
  betaOptIn: boolean;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  @ApiPropertyOptional({ example: ['feature-a', 'feature-b'] })
  enrolledFeatures?: string[];
}

export class BetaFeaturesResponseDto {
  @ApiProperty({ example: true })
  betaOptIn: boolean;

  @ApiPropertyOptional({ example: ['feature-a', 'feature-b'] })
  enrolledFeatures?: string[];

  @ApiProperty()
  updatedAt: Date;
}
