// @ts-nocheck
import type { CreateExpenseDto } from './createExpenseDto';

export interface BatchCreateExpenseDto {
  expenses: CreateExpenseDto[];
}
