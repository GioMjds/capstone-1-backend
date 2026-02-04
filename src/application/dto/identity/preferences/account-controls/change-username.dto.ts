import { IsString, MinLength, MaxLength, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ChangeUsernameDto {
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  @ApiProperty({ example: 'newusername' })
  newUsername: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  password?: string;
}

export class ChangeUsernameResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  username: string;

  @ApiProperty()
  updatedAt: Date;
}
