import { ApiProperty } from '@nestjs/swagger';
import { IsObject } from 'class-validator';

export class SetDefaultViewsDto {
  @IsObject()
  @ApiProperty({
    example: {
      dashboard: 'grid',
      projects: 'list',
      calendar: 'month',
    },
  })
  views: Record<string, string>;
}

export class SetDefaultViewsResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  views: Record<string, string>;

  @ApiProperty()
  updatedAt: Date;
}
