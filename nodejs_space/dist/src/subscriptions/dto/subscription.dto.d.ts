export declare class CreateSubscriptionDto {
    name: string;
    category: string;
    amount: number;
    currency?: string;
    billingCycle: string;
    nextRenewalDate: string;
    reminderDaysBefore?: number[];
    notes?: string;
}
export declare class UpdateSubscriptionDto {
    name?: string;
    category?: string;
    amount?: number;
    currency?: string;
    billingCycle?: string;
    nextRenewalDate?: string;
    reminderDaysBefore?: number[];
    notes?: string;
}
export declare class SubscriptionResponseDto {
    id: string;
    name: string;
    category: string;
    amount: number;
    currency: string;
    billingCycle: string;
    nextRenewalDate: string;
    reminderDaysBefore: number[];
    notes: string | null;
    createdAt: string;
    updatedAt: string;
}
export declare class SubscriptionListResponseDto {
    items: SubscriptionResponseDto[];
    total: number;
    page: number;
    totalPages: number;
}
export declare class SubscriptionUpcomingResponseDto {
    items: SubscriptionResponseDto[];
}
export declare class DeleteResponseDto {
    success: boolean;
}
