// @ts-nocheck

export interface ParsedExpenseItemDto {
  title: string;
  amount: number;
  category: string;
  date: string;
  /** @nullable */
  notes: string | null;
  originalSms: string;
}
