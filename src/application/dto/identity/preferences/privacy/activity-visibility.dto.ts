import { ActivityVisibility } from '@/domain/interfaces';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum } from 'class-validator';

export class UpdateActivityVisibilityDto {
  @IsEnum(ActivityVisibility)
  @ApiProperty({ enum: ActivityVisibility })
  visibility: ActivityVisibility;

  @IsBoolean()
  @ApiProperty()
  hideTimestamps?: boolean;
}

export class GetActivityVisibilityResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty({ enum: ActivityVisibility })
  visibility: ActivityVisibility;

  @ApiProperty()
  hideTimestamps: boolean;

  @ApiProperty()
  updatedAt: Date;
}
