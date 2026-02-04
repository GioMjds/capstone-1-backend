import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min, Max } from 'class-validator';

export class SetPaginationSizeDto {
  @IsNumber()
  @Min(5)
  @Max(100)
  @ApiProperty({ minimum: 5, maximum: 100, example: 20 })
  pageSize: number;
}

export class SetPaginationSizeResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  pageSize: number;

  @ApiProperty()
  availableSizes: number[];

  @ApiProperty()
  updatedAt: Date;
}
