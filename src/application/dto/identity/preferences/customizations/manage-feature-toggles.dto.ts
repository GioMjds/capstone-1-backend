import { ApiProperty } from '@nestjs/swagger';
import { IsObject } from 'class-validator';

export class ManageFeatureTogglesDto {
  @IsObject()
  @ApiProperty({
    example: {
      newDashboard: true,
      advancedAnalytics: false,
      experimentalUI: true,
    },
  })
  toggles: Record<string, boolean>;
}

export class ManageFeatureTogglesResponseDto {
  @ApiProperty({ example: 'user-id-placeholder' })
  id: string;

  @ApiProperty({
    example: {
      newDashboard: true,
      advancedAnalytics: false,
      experimentalUI: true,
    },
  })
  toggles: Record<string, boolean>;

  @ApiProperty()
  updatedAt: Date;
}
