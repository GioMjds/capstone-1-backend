import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsObject } from 'class-validator';

export class UpdateFieldLevelVisibilityDto {
  @IsString()
  @ApiProperty()
  fieldName: string;

  @IsString()
  @ApiProperty()
  visibility: string;
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
