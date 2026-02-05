import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export enum FieldVisibility {
  PUBLIC = 'public',
  CONTACTS = 'contacts',
  PRIVATE = 'private',
}

export class FieldVisibilityItem {
  @IsString()
  @ApiProperty({ example: 'email' })
  fieldName: string;

  @IsEnum(FieldVisibility)
  @ApiProperty({ enum: FieldVisibility, example: FieldVisibility.PRIVATE })
  visibility: FieldVisibility;
}

export class UpdateFieldLevelVisibilityDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FieldVisibilityItem)
  @ApiProperty({ type: [FieldVisibilityItem] })
  fields: FieldVisibilityItem[];
}

export class FieldLevelVisibilityResponseDto {
  @ApiProperty({ type: [FieldVisibilityItem] })
  fields: FieldVisibilityItem[];

  @ApiProperty()
  updatedAt: Date;
}
