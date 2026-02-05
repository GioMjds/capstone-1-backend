import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

export class SetPaginationSizeDto {
  @IsInt()
  @Min(5)
  @Max(100)
  @ApiProperty({ minimum: 5, maximum: 100, example: 20 })
  defaultPageSize: number;

  @IsInt()
  @Min(10)
  @Max(200)
  @IsOptional()
  @ApiPropertyOptional({ minimum: 10, maximum: 200, example: 100 })
  maxPageSize?: number;
}

export class PaginationSizeResponseDto {
  @ApiProperty({ example: 20 })
  defaultPageSize: number;

  @ApiProperty({ example: 100 })
  maxPageSize: number;

  @ApiProperty()
  updatedAt: Date;
}
