import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateOnlinePresenceSettingsDto {
  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional({ example: true })
  showOnlineStatus?: boolean;

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional({ example: true })
  showTypingIndicator?: boolean;

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional({ example: false })
  showReadReceipts?: boolean;
}

export class OnlinePresenceSettingsResponseDto {
  @ApiProperty({ example: true })
  showOnlineStatus: boolean;

  @ApiProperty({ example: true })
  showTypingIndicator: boolean;

  @ApiProperty({ example: false })
  showReadReceipts: boolean;

  @ApiProperty()
  updatedAt: Date;
}
