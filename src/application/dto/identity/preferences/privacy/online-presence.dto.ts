import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateOnlinePresenceSettingsDto {
  @IsBoolean()
  @ApiProperty()
  showOnlineStatus: boolean;

  @IsBoolean()
  @IsOptional()
  @ApiProperty()
  showLastSeen?: boolean;

  @IsBoolean()
  @IsOptional()
  @ApiProperty()
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
