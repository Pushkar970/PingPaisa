export declare class CreateExpenseDto {
    title: string;
    amount: number;
    category: string;
    date: string;
    notes?: string;
    source?: string;
}
export declare class UpdateExpenseDto {
    title?: string;
    amount?: number;
    category?: string;
    date?: string;
    notes?: string;
}
export declare class ParseSmsDto {
    messages: string[];
}
export declare class ParsedExpenseItemDto {
    title: string;
    amount: number;
    category: string;
    date: string;
    notes: string | null;
    originalSms: string;
}
export declare class ParseSmsResponseDto {
    parsed: ParsedExpenseItemDto[];
    total: number;
    failed: number;
}
export declare class BatchCreateExpenseDto {
    expenses: CreateExpenseDto[];
}
export declare class ExpenseResponseDto {
    id: string;
    title: string;
    amount: number;
    category: string;
    date: string;
    notes: string | null;
    source: string;
    createdAt: string;
    updatedAt: string;
}
export declare class BatchCreateResponseDto {
    items: ExpenseResponseDto[];
    count: number;
}
export declare class ExpenseListResponseDto {
    items: ExpenseResponseDto[];
    total: number;
    page: number;
    totalPages: number;
}
