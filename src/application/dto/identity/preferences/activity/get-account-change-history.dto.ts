import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, Min, Max } from 'class-validator';

export class GetAccountChangeHistoryDto {
  @IsNumber()
  @IsOptional()
  @Min(1)
  @ApiPropertyOptional({ default: 1 })
  @Type(() => Number)
  page?: number = 1;

  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(100)
  @ApiPropertyOptional({ default: 20 })
  @Type(() => Number)
  limit?: number = 20;
}

export class AccountChangeDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  timestamp: Date;

  @ApiProperty()
  changeType: string;

  @ApiProperty()
  fieldChanged: string;

  @ApiProperty()
  oldValue?: string;

  @ApiProperty()
  newValue?: string;

  @ApiProperty()
  changedBy: string;

  @ApiProperty()
  ipAddress: string;
}

export class GetAccountChangeHistoryResponseDto {
  @ApiProperty()
  totalCount: number;

  @ApiProperty({ type: [AccountChangeDto] })
  changes: AccountChangeDto[];

  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  totalPages: number;
}
