import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SetCurrencyDto {
  @IsString()
  @ApiProperty({ example: 'USD', description: 'ISO 4217 currency code' })
  currency: string;
}

export class SetCurrencyResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  currency: string;

  @ApiProperty()
  symbol: string;

  @ApiProperty()
  updatedAt: Date;
}
