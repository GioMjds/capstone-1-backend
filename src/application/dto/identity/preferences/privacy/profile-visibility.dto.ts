import { ProfileVisibility } from '@/domain/interfaces';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

export class UpdateProfileVisibilityDto {
  @IsEnum(ProfileVisibility)
  @ApiProperty({ enum: ProfileVisibility })
  visibility: ProfileVisibility;
}

export class GetProfileVisibilityResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty({ enum: ProfileVisibility })
  visibility: ProfileVisibility;

  @ApiProperty()
  updatedAt: Date;
}
