import { ApiProperty } from '@nestjs/swagger';

export class AuthUserDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  name: string;
}

export class AuthResponseDto {
  @ApiProperty()
  token: string;

  @ApiProperty({ type: AuthUserDto })
  user: AuthUserDto;
}

export class MeUserDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  tier: string;

  @ApiProperty()
  createdAt: string;
}

export class MeResponseDto {
  @ApiProperty({ type: MeUserDto })
  user: MeUserDto;
}
