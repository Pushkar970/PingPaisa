// @ts-nocheck
import type { SubscriptionResponseDto } from './subscriptionResponseDto';

export interface SubscriptionListResponseDto {
  items: SubscriptionResponseDto[];
  total: number;
  page: number;
  totalPages: number;
}
