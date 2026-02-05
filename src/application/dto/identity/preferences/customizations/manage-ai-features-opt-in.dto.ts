import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString } from 'class-validator';

export class ManageAiFeaturesOptInDto {
  @IsBoolean()
  @ApiProperty({ example: true })
  optIn: boolean;
}

export class ManageAiFeaturesOptInResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  @IsBoolean()
  optedInAiFeatures: boolean;

  @ApiProperty()
  @IsString({ each: true })
  availableFeatures: string[];

  @ApiProperty()
  @IsString()
  privacyLevel: string;

  @ApiProperty()
  updatedAt: Date;
}
