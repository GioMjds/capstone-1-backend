import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateOnlinePresenceSettingsDto {
  @IsBoolean()
  @ApiProperty({ example: true })
  showOnlineStatus: boolean;

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional({ example: true })
  showLastSeen?: boolean;

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional({ example: false })
  hideFromFriendsList?: boolean;
}

export class GetOnlinePresenceSettingsResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  showOnlineStatus: boolean;

  @ApiProperty()
  showLastSeen: boolean;

  @ApiProperty()
  hideFromFriendsList: boolean;

  @ApiProperty()
  updatedAt: Date;
}
