import { ApiProperty } from '@nestjs/swagger';
import { IsObject } from 'class-validator';

export class ConfigurePushNotificationsDto {
  @IsObject()
  @ApiProperty({
    example: {
      security: true,
      messages: true,
      updates: false,
      reminders: true,
    },
  })
  categories: Record<string, boolean>;
}

export class PushNotificationCategoriesResponseDto {
  @ApiProperty({
    example: {
      security: true,
      messages: true,
      updates: false,
      reminders: true,
    },
  })
  categories: Record<string, boolean>;

  @ApiProperty()
  updatedAt: Date;
}
