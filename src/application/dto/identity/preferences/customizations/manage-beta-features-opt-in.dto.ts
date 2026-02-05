import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString } from 'class-validator';

export class ManageBetaFeaturesOptInDto {
  @IsBoolean()
  @ApiProperty()
  optIn: boolean;
}

export class ManageBetaFeaturesOptInResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  @IsBoolean()
  optedInBetaFeatures: boolean;

  @ApiProperty()
  @IsString({ each: true })
  availableFeatures: string[];

  @ApiProperty()
  updatedAt: Date;
}
