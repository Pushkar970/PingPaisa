import type { Request } from 'express';
import { IncomeService } from './income.service';
import { CreateIncomeDto, UpdateIncomeDto, IncomeResponseDto, IncomeListResponseDto, ParseCreditSmsDto, ParseCreditSmsResponseDto, BatchCreateIncomeDto, BatchCreateIncomeResponseDto } from './dto/income.dto';
import { DeleteResponseDto } from '../subscriptions/dto/subscription.dto';
export declare class IncomeController {
    private service;
    constructor(service: IncomeService);
    findAll(req: Request, page?: number, limit?: number, month?: string, category?: string): Promise<IncomeListResponseDto>;
    findOne(req: Request, id: string): Promise<IncomeResponseDto>;
    parseCreditSms(dto: ParseCreditSmsDto): Promise<ParseCreditSmsResponseDto>;
    createBatch(req: Request, dto: BatchCreateIncomeDto): Promise<BatchCreateIncomeResponseDto>;
    create(req: Request, dto: CreateIncomeDto): Promise<IncomeResponseDto>;
    update(req: Request, id: string, dto: UpdateIncomeDto): Promise<IncomeResponseDto>;
    remove(req: Request, id: string): Promise<DeleteResponseDto>;
}
