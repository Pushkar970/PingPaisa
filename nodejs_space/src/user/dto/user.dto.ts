import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, Min } from 'class-validator';

export class PlanResponseDto {
  @ApiProperty()
  tier: string;

  @ApiProperty()
  aiQueriesUsed: number;

  @ApiProperty()
  aiQueriesLimit: number;

  @ApiProperty()
  subscriptionCount: number;

  @ApiProperty()
  subscriptionLimit: number;

  @ApiProperty()
  currentPeriodStart: string;

  @ApiProperty({ nullable: true })
  monthlyLimit: number | null;

  @ApiProperty()
  monthlySpent: number;

  @ApiProperty()
  limitExceeded: boolean;
}

export class UpgradeResponseDto {
  @ApiProperty()
  success: boolean;

  @ApiProperty()
  tier: string;
}

export class SetMonthlyLimitDto {
  @IsNumber()
  @IsOptional()
  @Min(0)
  limit: number | null;
}

export class MonthlyLimitResponseDto {
  @ApiProperty()
  success: boolean;

  @ApiProperty({ nullable: true })
  monthlyLimit: number | null;
}
