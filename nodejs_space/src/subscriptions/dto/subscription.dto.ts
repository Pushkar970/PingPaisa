import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsArray, IsDateString, IsIn, IsInt, Min } from 'class-validator';

export class CreateSubscriptionDto {
  @IsString()
  name: string;

  @IsString()
  category: string;

  @IsNumber()
  @Min(0.01)
  amount: number;

  @IsString()
  @IsOptional()
  currency?: string;

  @IsString()
  @IsIn(['weekly', 'monthly', 'yearly'])
  billingCycle: string;

  @IsDateString()
  nextRenewalDate: string;

  @IsArray()
  @IsInt({ each: true })
  @Min(0, { each: true })
  @IsOptional()
  reminderDaysBefore?: number[];

  @IsString()
  @IsOptional()
  notes?: string;
}

export class UpdateSubscriptionDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsNumber()
  @Min(0.01)
  @IsOptional()
  amount?: number;

  @IsString()
  @IsOptional()
  currency?: string;

  @IsString()
  @IsIn(['weekly', 'monthly', 'yearly'])
  @IsOptional()
  billingCycle?: string;

  @IsDateString()
  @IsOptional()
  nextRenewalDate?: string;

  @IsArray()
  @IsInt({ each: true })
  @Min(0, { each: true })
  @IsOptional()
  reminderDaysBefore?: number[];

  @IsString()
  @IsOptional()
  notes?: string;
}

export class SubscriptionResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  category: string;

  @ApiProperty()
  amount: number;

  @ApiProperty()
  currency: string;

  @ApiProperty()
  billingCycle: string;

  @ApiProperty()
  nextRenewalDate: string;

  @ApiProperty({ type: [Number] })
  reminderDaysBefore: number[];

  @ApiProperty({ nullable: true })
  notes: string | null;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  updatedAt: string;
}

export class SubscriptionListResponseDto {
  @ApiProperty({ type: [SubscriptionResponseDto] })
  items: SubscriptionResponseDto[];

  @ApiProperty()
  total: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  totalPages: number;
}

export class SubscriptionUpcomingResponseDto {
  @ApiProperty({ type: [SubscriptionResponseDto] })
  items: SubscriptionResponseDto[];
}

export class DeleteResponseDto {
  @ApiProperty()
  success: boolean;
}
