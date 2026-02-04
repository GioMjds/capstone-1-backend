import { LoginHistorySortBy } from '@/domain/interfaces';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, Min, Max, IsEnum } from 'class-validator';

export class GetLoginHistoryDto {
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

  @IsEnum(LoginHistorySortBy)
  @IsOptional()
  @ApiPropertyOptional({ enum: LoginHistorySortBy, default: LoginHistorySortBy.DATE })
  sortBy?: LoginHistorySortBy = LoginHistorySortBy.DATE;
}

export class LoginAttemptDto {
  @ApiProperty()
  timestamp: Date;

  @ApiProperty()
  ipAddress: string;

  @ApiProperty()
  deviceName: string;

  @ApiProperty()
  location?: string;

  @ApiProperty()
  status: 'success' | 'failed';

  @ApiProperty()
  reason?: string;
}

export class GetLoginHistoryResponseDto {
  @ApiProperty()
  totalCount: number;

  @ApiProperty({ type: [LoginAttemptDto] })
  loginAttempts: LoginAttemptDto[];

  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  totalPages: number;
}
