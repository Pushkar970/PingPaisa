// @ts-nocheck
import type { ExpenseResponseDto } from './expenseResponseDto';

export interface ExpenseListResponseDto {
  items: ExpenseResponseDto[];
  total: number;
  page: number;
  totalPages: number;
}
