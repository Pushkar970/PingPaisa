// @ts-nocheck

export interface PlanResponseDto {
  tier: string;
  aiQueriesUsed: number;
  aiQueriesLimit: number;
  subscriptionCount: number;
  subscriptionLimit: number;
  currentPeriodStart: string;
  /** @nullable */
  monthlyLimit: number | null;
  monthlySpent: number;
  limitExceeded: boolean;
}
