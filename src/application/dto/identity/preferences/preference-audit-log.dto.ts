import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PreferenceAuditLogDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  category: string;

  @ApiProperty()
  field: string;

  @ApiPropertyOptional()
  oldValue?: Record<string, any>;

  @ApiProperty()
  newValue: Record<string, any>;

  @ApiProperty()
  changedBy: string;

  @ApiPropertyOptional()
  changeReason?: string;

  @ApiProperty()
  createdAt: Date;
}

export class AuditLogsResponseDto {
  @ApiProperty({ type: [PreferenceAuditLogDto] })
  logs: PreferenceAuditLogDto[];

  @ApiProperty()
  total: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;

  @ApiPropertyOptional()
  category?: string;
}
