// @ts-nocheck

export interface CreateIncomeDto {
  title: string;
  /** @minimum 0.01 */
  amount: number;
  category: string;
  date: string;
  notes?: string;
  source?: string;
}
