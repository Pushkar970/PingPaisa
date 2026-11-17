// @ts-nocheck
import type { ParsedExpenseItemDto } from './parsedExpenseItemDto';

export interface ParseSmsResponseDto {
  parsed: ParsedExpenseItemDto[];
  total: number;
  failed: number;
}
