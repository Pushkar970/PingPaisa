export declare class CreateIncomeDto {
    title: string;
    amount: number;
    category: string;
    date: string;
    notes?: string;
    source?: string;
}
export declare class UpdateIncomeDto {
    title?: string;
    amount?: number;
    category?: string;
    date?: string;
    notes?: string;
}
export declare class ParseCreditSmsDto {
    messages: string[];
}
export declare class ParsedIncomeItemDto {
    title: string;
    amount: number;
    category: string;
    date: string;
    notes: string | null;
    originalSms: string;
}
export declare class ParseCreditSmsResponseDto {
    parsed: ParsedIncomeItemDto[];
    total: number;
    failed: number;
}
export declare class BatchCreateIncomeDto {
    incomes: CreateIncomeDto[];
}
export declare class IncomeResponseDto {
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
export declare class BatchCreateIncomeResponseDto {
    items: IncomeResponseDto[];
    count: number;
}
export declare class IncomeListResponseDto {
    items: IncomeResponseDto[];
    total: number;
    page: number;
    totalPages: number;
}
