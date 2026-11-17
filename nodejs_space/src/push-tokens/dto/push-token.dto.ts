import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsIn } from 'class-validator';

export class CreatePushTokenDto {
  @IsString()
  token: string;

  @IsString()
  @IsIn(['ios', 'android'])
  deviceType: string;
}

export class PushTokenResponseDto {
  @ApiProperty()
  success: boolean;
}
