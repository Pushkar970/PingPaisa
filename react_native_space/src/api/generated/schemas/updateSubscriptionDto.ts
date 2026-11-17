// @ts-nocheck

export interface UpdateSubscriptionDto {
  name?: string;
  category?: string;
  amount?: number;
  currency?: string;
  billingCycle?: string;
  nextRenewalDate?: string;
  reminderDaysBefore?: number[];
  notes?: string;
}
