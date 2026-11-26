import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsIn, MinLength, MaxLength } from 'class-validator';

export class CreatePushTokenDto {
  @IsString()
  @MinLength(1)
  @MaxLength(512)
  token: string;

  @IsString()
  @IsIn(['ios', 'android'])
  deviceType: string;
}

export class PushTokenResponseDto {
  @ApiProperty()
  success: boolean;
}
