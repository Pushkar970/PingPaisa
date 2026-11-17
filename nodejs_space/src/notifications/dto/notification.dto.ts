import { ApiProperty } from '@nestjs/swagger';

export class InactivityReminderResponseDto {
  @ApiProperty()
  usersNotified: number;

  @ApiProperty()
  usersSkipped: number;

  @ApiProperty()
  totalUsers: number;
}
