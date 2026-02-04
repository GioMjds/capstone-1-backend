import { ApiProperty } from '@nestjs/swagger';
import { IsObject } from 'class-validator';

export class ConfigureEmailNotificationsByCategoryDto {
  @IsObject()
  @ApiProperty({
    example: {
      security: true,
      updates: true,
      marketing: false,
      comments: true,
    },
  })
  categories: Record<string, boolean>;
}

export class ConfigureEmailNotificationsByCategoryResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  categories: Record<string, boolean>;

  @ApiProperty()
  updatedAt: Date;
}
