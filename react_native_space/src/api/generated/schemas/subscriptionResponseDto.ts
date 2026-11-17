// @ts-nocheck

export interface SubscriptionResponseDto {
  id: string;
  name: string;
  category: string;
  amount: number;
  currency: string;
  billingCycle: string;
  nextRenewalDate: string;
  reminderDaysBefore: number[];
  /** @nullable */
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}
