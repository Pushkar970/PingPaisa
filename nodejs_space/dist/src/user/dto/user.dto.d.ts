export declare class PlanResponseDto {
    tier: string;
    aiQueriesUsed: number;
    aiQueriesLimit: number;
    subscriptionCount: number;
    subscriptionLimit: number;
    currentPeriodStart: string;
    monthlyLimit: number | null;
    monthlySpent: number;
    limitExceeded: boolean;
}
export declare class UpgradeResponseDto {
    success: boolean;
    tier: string;
}
export declare class SetMonthlyLimitDto {
    limit: number | null;
}
export declare class MonthlyLimitResponseDto {
    success: boolean;
    monthlyLimit: number | null;
}
