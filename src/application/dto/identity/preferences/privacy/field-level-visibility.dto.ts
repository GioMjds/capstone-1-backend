import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum, IsObject } from 'class-validator';

export enum FieldVisibility {
  PUBLIC = 'public',
  FRIENDS = 'friends',
  PRIVATE = 'private',
}

export class UpdateFieldLevelVisibilityDto {
  @IsString()
  @ApiProperty({ example: 'email' })
  fieldName: string;

  @IsEnum(FieldVisibility)
  @ApiProperty({ enum: FieldVisibility, example: FieldVisibility.PRIVATE })
  visibility: FieldVisibility;
}

export class GetFieldLevelVisibilityResponseDto {
  @ApiProperty()
  id: string;

  @IsObject()
  @ApiProperty()
  fieldVisibilities: Record<string, string>;

  @ApiProperty()
  updatedAt: Date;
}
