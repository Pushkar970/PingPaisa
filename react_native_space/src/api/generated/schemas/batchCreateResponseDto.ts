// @ts-nocheck
import type { ExpenseResponseDto } from './expenseResponseDto';

export interface BatchCreateResponseDto {
  items: ExpenseResponseDto[];
  count: number;
}
