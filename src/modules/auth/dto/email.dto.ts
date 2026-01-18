import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class VerifyUserDto {
  @ApiProperty({ 
    description: 'Email verification token received via email after registration',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1c3JfOGY5MmtkbGEyMSIsImlhdCI6MTcwNTU4MTIwMH0.abc123',
    required: true
  })
  @IsString()
  token: string;
}
