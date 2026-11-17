// @ts-nocheck
import type { IncomeResponseDto } from './incomeResponseDto';

export interface IncomeListResponseDto {
  items: IncomeResponseDto[];
  total: number;
  page: number;
  totalPages: number;
}
