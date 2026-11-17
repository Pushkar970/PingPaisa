// @ts-nocheck

export interface ParsedIncomeItemDto {
  title: string;
  amount: number;
  category: string;
  date: string;
  /** @nullable */
  notes: string | null;
  originalSms: string;
}
