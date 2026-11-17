// @ts-nocheck
import type { ParsedIncomeItemDto } from './parsedIncomeItemDto';

export interface ParseCreditSmsResponseDto {
  parsed: ParsedIncomeItemDto[];
  total: number;
  failed: number;
}
