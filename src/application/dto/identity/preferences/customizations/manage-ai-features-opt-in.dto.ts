import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class ManageAiFeaturesOptInDto {
  @IsBoolean()
  @ApiProperty()
  optIn: boolean;
}

export class ManageAiFeaturesOptInResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  optedInAiFeatures: boolean;

  @ApiProperty()
  availableFeatures: string[];

  @ApiProperty()
  privacyLevel: string;

  @ApiProperty()
  updatedAt: Date;
}
