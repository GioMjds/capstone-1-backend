import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class ManageBetaFeaturesOptInDto {
  @IsBoolean()
  @ApiProperty()
  optIn: boolean;
}

export class ManageBetaFeaturesOptInResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  optedInBetaFeatures: boolean;

  @ApiProperty()
  availableFeatures: string[];

  @ApiProperty()
  updatedAt: Date;
}
