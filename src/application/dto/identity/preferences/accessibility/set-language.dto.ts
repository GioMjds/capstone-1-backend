import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsLocale } from 'class-validator';

export class SetLanguageDto {
  @IsString()
  @IsLocale()
  @ApiProperty({ example: 'en-US', description: 'Language locale code' })
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
