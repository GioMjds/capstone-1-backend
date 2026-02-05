import { IsString, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { RecoveryOptionType } from '@/domain/interfaces';

export class ManageRecoveryOptionsDto {
  @IsEnum(RecoveryOptionType)
  @ApiProperty({ enum: RecoveryOptionType })
  type: RecoveryOptionType;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ example: 'recovery@example.com' })
  value?: string;

  @IsString()
  @ApiProperty({ enum: ['add', 'remove', 'verify'], example: 'add' })
  action: 'add' | 'remove' | 'verify';
}

export class ManageRecoveryOptionsResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  type: RecoveryOptionType;

  @ApiProperty()
  isVerified: boolean;

  @ApiProperty()
  updatedAt: Date;
}
