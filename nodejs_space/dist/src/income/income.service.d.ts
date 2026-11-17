import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
export declare class IncomeService {
    private prisma;
    private configService;
    private readonly logger;
    constructor(prisma: PrismaService, configService: ConfigService);
    findAll(userId: string, page?: number, limit?: number, month?: string, category?: string): Promise<{
        items: {
            id: any;
            title: any;
            amount: number;
            category: any;
            date: any;
            notes: any;
            source: any;
            createdAt: any;
            updatedAt: any;
        }[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    findOne(userId: string, id: string): Promise<{
        id: any;
        title: any;
        amount: number;
        category: any;
        date: any;
        notes: any;
        source: any;
        createdAt: any;
        updatedAt: any;
    }>;
    create(userId: string, data: any): Promise<{
        id: any;
        title: any;
        amount: number;
        category: any;
        date: any;
        notes: any;
        source: any;
        createdAt: any;
        updatedAt: any;
    }>;
    update(userId: string, id: string, data: any): Promise<{
        id: any;
        title: any;
        amount: number;
        category: any;
        date: any;
        notes: any;
        source: any;
        createdAt: any;
        updatedAt: any;
    }>;
    remove(userId: string, id: string): Promise<{
        success: boolean;
    }>;
    createBatch(userId: string, incomes: any[]): Promise<{
        items: {
            id: any;
            title: any;
            amount: number;
            category: any;
            date: any;
            notes: any;
            source: any;
            createdAt: any;
            updatedAt: any;
        }[];
        count: number;
    }>;
    parseCreditSmsMessages(messages: string[]): Promise<{
        parsed: any;
        total: number;
        failed: number;
    }>;
}
