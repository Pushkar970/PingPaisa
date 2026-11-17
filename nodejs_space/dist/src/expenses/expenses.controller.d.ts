import type { Request } from 'express';
import { ExpensesService } from './expenses.service';
import { CreateExpenseDto, UpdateExpenseDto, ExpenseResponseDto, ExpenseListResponseDto, ParseSmsDto, ParseSmsResponseDto, BatchCreateExpenseDto, BatchCreateResponseDto } from './dto/expense.dto';
import { DeleteResponseDto } from '../subscriptions/dto/subscription.dto';
export declare class ExpensesController {
    private service;
    constructor(service: ExpensesService);
    findAll(req: Request, page?: number, limit?: number, month?: string, category?: string): Promise<ExpenseListResponseDto>;
    findOne(req: Request, id: string): Promise<ExpenseResponseDto>;
    parseSms(dto: ParseSmsDto): Promise<ParseSmsResponseDto>;
    createBatch(req: Request, dto: BatchCreateExpenseDto): Promise<BatchCreateResponseDto>;
    create(req: Request, dto: CreateExpenseDto): Promise<ExpenseResponseDto>;
    update(req: Request, id: string, dto: UpdateExpenseDto): Promise<ExpenseResponseDto>;
    remove(req: Request, id: string): Promise<DeleteResponseDto>;
}
