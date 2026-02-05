import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';

export enum ViewType {
  GRID = 'grid',
  LIST = 'list',
  KANBAN = 'kanban',
  TABLE = 'table',
}

export enum CalendarViewType {
  DAY = 'day',
  WEEK = 'week',
  MONTH = 'month',
  YEAR = 'year',
}

export class SetDefaultViewsDto {
  @IsEnum(ViewType)
  @IsOptional()
  @ApiPropertyOptional({ enum: ViewType, example: ViewType.GRID })
  dashboardView?: ViewType;

  @IsEnum(ViewType)
  @IsOptional()
  @ApiPropertyOptional({ enum: ViewType, example: ViewType.LIST })
  listView?: ViewType;

  @IsEnum(CalendarViewType)
  @IsOptional()
  @ApiPropertyOptional({ enum: CalendarViewType, example: CalendarViewType.MONTH })
  calendarView?: CalendarViewType;
}

export class DefaultViewsResponseDto {
  @ApiProperty({ enum: ViewType, example: ViewType.GRID })
  dashboardView: ViewType;

  @ApiProperty({ enum: ViewType, example: ViewType.LIST })
  listView: ViewType;

  @ApiProperty({ enum: CalendarViewType, example: CalendarViewType.MONTH })
  calendarView: CalendarViewType;

  @ApiProperty()
  updatedAt: Date;
}
