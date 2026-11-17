// @ts-nocheck
import type { BiggestSubscriptionDto } from './biggestSubscriptionDto';
import type { TopCategoryDto } from './topCategoryDto';

export interface DashboardStatsResponseDto {
  monthlySpend: number;
  yearlySpend: number;
  monthlyIncome: number;
  yearlyIncome: number;
  activeSubscriptionCount: number;
  /** @nullable */
  biggestSubscription: BiggestSubscriptionDto | null;
  /** @nullable */
  topCategory: TopCategoryDto | null;
  monthOverMonthChange: number;
}
