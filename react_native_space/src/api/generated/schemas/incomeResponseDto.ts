// @ts-nocheck

export interface IncomeResponseDto {
  id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
  /** @nullable */
  notes: string | null;
  source: string;
  createdAt: string;
  updatedAt: string;
}
