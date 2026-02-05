import { ApiProperty } from '@nestjs/swagger';
import { IsObject } from 'class-validator';

export class ConfigureEmailNotificationsDto {
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

export class EmailNotificationCategoriesResponseDto {
  @ApiProperty({
    example: {
      security: true,
      updates: true,
      marketing: false,
      comments: true,
    },
  })
  categories: Record<string, boolean>;

  @ApiProperty()
  updatedAt: Date;
}
