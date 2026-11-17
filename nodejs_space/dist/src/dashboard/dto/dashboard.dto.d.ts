export declare class BiggestSubscriptionDto {
    name: string;
    amount: number;
}
export declare class TopCategoryDto {
    name: string;
    amount: number;
}
export declare class DashboardStatsResponseDto {
    monthlySpend: number;
    yearlySpend: number;
    monthlyIncome: number;
    yearlyIncome: number;
    activeSubscriptionCount: number;
    biggestSubscription: BiggestSubscriptionDto | null;
    topCategory: TopCategoryDto | null;
    monthOverMonthChange: number;
}
export declare class CategoryBreakdownItemDto {
    category: string;
    amount: number;
    percentage: number;
}
export declare class CategoryBreakdownResponseDto {
    items: CategoryBreakdownItemDto[];
}
export declare class TrendItemDto {
    month: string;
    amount: number;
}
export declare class TrendsResponseDto {
    items: TrendItemDto[];
}
export declare class SplitResponseDto {
    subscriptionTotal: number;
    expenseTotal: number;
    month: string;
}
