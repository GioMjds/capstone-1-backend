import { ApiProperty } from '@nestjs/swagger';
import { IsObject } from 'class-validator';

export class SetSortFilterDefaultsDto {
  @IsObject()
  @ApiProperty({
    example: {
      sortBy: 'date',
      sortOrder: 'desc',
      filters: ['active'],
    },
    type: 'object',
    additionalProperties: true,
  })
  defaults: Record<string, unknown>;
}

export class SetSortFilterDefaultsResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  @IsObject()
  defaults: Record<string, any>;

  @ApiProperty()
  updatedAt: Date;
}
