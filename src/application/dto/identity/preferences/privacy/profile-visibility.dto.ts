import { ProfileVisibility } from '@/domain/interfaces';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsOptional } from 'class-validator';

export class UpdateProfileVisibilityDto {
  @IsEnum(ProfileVisibility)
  @IsOptional()
  @ApiPropertyOptional({ enum: ProfileVisibility, example: ProfileVisibility.PUBLIC })
  profileVisibility?: ProfileVisibility;

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional({ example: false })
  showEmail?: boolean;

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional({ example: false })
  showPhone?: boolean;

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional({ example: true })
  showBirthday?: boolean;
}

export class ProfileVisibilityResponseDto {
  @ApiProperty({ enum: ProfileVisibility, example: ProfileVisibility.PUBLIC })
  profileVisibility: ProfileVisibility;

  @ApiProperty({ example: false })
  showEmail: boolean;

  @ApiProperty({ example: false })
  showPhone: boolean;

  @ApiProperty({ example: true })
  showBirthday: boolean;

  @ApiProperty()
  updatedAt: Date;
}
