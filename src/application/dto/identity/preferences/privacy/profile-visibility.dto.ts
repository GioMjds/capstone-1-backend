import { ProfileVisibility, VisibilityLevel } from '@/domain/interfaces';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';

export class UpdateProfileVisibilityDto {
  @IsEnum(VisibilityLevel)
  @ApiProperty({ enum: VisibilityLevel, example: VisibilityLevel.PRIVATE })
  visibility: VisibilityLevel;

  @IsOptional()
  @ApiPropertyOptional({
    description: 'Custom visibility rules (for CUSTOM level)',
  })
  customRules?: Record<string, unknown>;
}

export class GetProfileVisibilityResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty({ enum: ProfileVisibility })
  visibility: ProfileVisibility;

  @ApiProperty()
  updatedAt: Date;
}
