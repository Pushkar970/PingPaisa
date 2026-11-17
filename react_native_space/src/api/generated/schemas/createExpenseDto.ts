// @ts-nocheck

export interface CreateExpenseDto {
  title: string;
  /** @minimum 0.01 */
  amount: number;
  category: string;
  date: string;
  notes?: string;
  source?: string;
}
