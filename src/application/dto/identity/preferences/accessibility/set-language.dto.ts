import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SetLanguageDto {
  @IsString()
  @ApiProperty({ example: 'en', description: 'Language code (ISO 639-1)' })
  language: string;
}

export class SetLanguageResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  language: string;

  @ApiProperty()
  appliesImmediately: boolean;

  @ApiProperty()
  updatedAt: Date;
}
