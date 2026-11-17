import { ApiProperty } from '@nestjs/swagger';

export class BiggestSubscriptionDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  amount: number;
}

export class TopCategoryDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  amount: number;
}

export class DashboardStatsResponseDto {
  @ApiProperty()
  monthlySpend: number;

  @ApiProperty()
  yearlySpend: number;

  @ApiProperty()
  monthlyIncome: number;

  @ApiProperty()
  yearlyIncome: number;

  @ApiProperty()
  activeSubscriptionCount: number;

  @ApiProperty({ nullable: true, type: BiggestSubscriptionDto })
  biggestSubscription: BiggestSubscriptionDto | null;

  @ApiProperty({ nullable: true, type: TopCategoryDto })
  topCategory: TopCategoryDto | null;

  @ApiProperty()
  monthOverMonthChange: number;
}

export class CategoryBreakdownItemDto {
  @ApiProperty()
  category: string;

  @ApiProperty()
  amount: number;

  @ApiProperty()
  percentage: number;
}

export class CategoryBreakdownResponseDto {
  @ApiProperty({ type: [CategoryBreakdownItemDto] })
  items: CategoryBreakdownItemDto[];
}

export class TrendItemDto {
  @ApiProperty()
  month: string;

  @ApiProperty()
  amount: number;
}

export class TrendsResponseDto {
  @ApiProperty({ type: [TrendItemDto] })
  items: TrendItemDto[];
}

export class SplitResponseDto {
  @ApiProperty()
  subscriptionTotal: number;

  @ApiProperty()
  expenseTotal: number;

  @ApiProperty()
  month: string;
}
