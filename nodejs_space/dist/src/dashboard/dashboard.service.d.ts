import { PrismaService } from '../prisma/prisma.service';
export declare class DashboardService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    getStats(userId: string): Promise<{
        monthlySpend: number;
        yearlySpend: number;
        monthlyIncome: number;
        yearlyIncome: number;
        activeSubscriptionCount: number;
        biggestSubscription: {
            name: string;
            amount: number;
        } | null;
        topCategory: {
            name: string;
            amount: number;
        } | null;
        monthOverMonthChange: number;
    }>;
    getCategoryBreakdown(userId: string, period: string): Promise<{
        items: {
            category: string;
            amount: number;
            percentage: number;
        }[];
    }>;
    getTrends(userId: string): Promise<{
        items: {
            month: string;
            amount: number;
        }[];
    }>;
    getSplit(userId: string): Promise<{
        subscriptionTotal: number;
        expenseTotal: number;
        month: string;
    }>;
}
