import { PrismaService } from '../prisma/prisma.service';
export declare class SubscriptionsService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    findAll(userId: string, page?: number, limit?: number): Promise<{
        items: {
            id: any;
            name: any;
            category: any;
            amount: number;
            currency: any;
            billingCycle: any;
            nextRenewalDate: any;
            reminderDaysBefore: any;
            notes: any;
            createdAt: any;
            updatedAt: any;
        }[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    findUpcoming(userId: string, days: number): Promise<{
        items: {
            id: any;
            name: any;
            category: any;
            amount: number;
            currency: any;
            billingCycle: any;
            nextRenewalDate: any;
            reminderDaysBefore: any;
            notes: any;
            createdAt: any;
            updatedAt: any;
        }[];
    }>;
    findOne(userId: string, id: string): Promise<{
        id: any;
        name: any;
        category: any;
        amount: number;
        currency: any;
        billingCycle: any;
        nextRenewalDate: any;
        reminderDaysBefore: any;
        notes: any;
        createdAt: any;
        updatedAt: any;
    }>;
    create(userId: string, data: any): Promise<{
        id: any;
        name: any;
        category: any;
        amount: number;
        currency: any;
        billingCycle: any;
        nextRenewalDate: any;
        reminderDaysBefore: any;
        notes: any;
        createdAt: any;
        updatedAt: any;
    }>;
    update(userId: string, id: string, data: any): Promise<{
        id: any;
        name: any;
        category: any;
        amount: number;
        currency: any;
        billingCycle: any;
        nextRenewalDate: any;
        reminderDaysBefore: any;
        notes: any;
        createdAt: any;
        updatedAt: any;
    }>;
    remove(userId: string, id: string): Promise<{
        success: boolean;
    }>;
}
