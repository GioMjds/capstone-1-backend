import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class AnonymizeDataDto {
  @IsBoolean()
  @ApiProperty()
  confirmAnonymization: boolean;
}

export class AnonymizeDataResponseDto {
  @ApiProperty()
  status: string;

  @ApiProperty()
  message: string;

  @ApiProperty()
  anonymizedAt: Date;

  @ApiProperty()
  dataPreserved: boolean;
}
