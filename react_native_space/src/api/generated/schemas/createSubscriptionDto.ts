// @ts-nocheck

export interface CreateSubscriptionDto {
  name: string;
  category: string;
  /** @minimum 0.01 */
  amount: number;
  currency?: string;
  billingCycle: string;
  nextRenewalDate: string;
  reminderDaysBefore?: number[];
  notes?: string;
}
