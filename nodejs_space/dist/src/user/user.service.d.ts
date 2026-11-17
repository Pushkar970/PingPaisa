import { PrismaService } from '../prisma/prisma.service';
export declare class UserService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    private getMonthlySpent;
    getPlan(userId: string): Promise<{
        tier: string;
        aiQueriesUsed: number;
        aiQueriesLimit: number;
        subscriptionCount: number;
        subscriptionLimit: number;
        currentPeriodStart: string;
        monthlyLimit: number | null;
        monthlySpent: number;
        limitExceeded: boolean;
    }>;
    setMonthlyLimit(userId: string, limit: number | null): Promise<{
        success: boolean;
        monthlyLimit: number | null;
    }>;
    upgrade(userId: string): Promise<{
        success: boolean;
        tier: string;
    }>;
}
