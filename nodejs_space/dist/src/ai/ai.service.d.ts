import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
export declare class AiService {
    private prisma;
    private configService;
    private readonly logger;
    constructor(prisma: PrismaService, configService: ConfigService);
    private checkAndIncrementQuota;
    private buildFinancialContext;
    chat(userId: string, message: string, conversationId?: string): Promise<{
        conversationId: string;
        message: {
            id: string;
            role: string;
            content: string;
            createdAt: string;
        };
    }>;
    getConversations(userId: string): Promise<{
        items: {
            id: string;
            lastMessage: string;
            updatedAt: string;
        }[];
    }>;
    getMessages(userId: string, conversationId: string, page?: number, limit?: number): Promise<{
        items: {
            id: string;
            role: string;
            content: string;
            createdAt: string;
        }[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    getSuggestions(userId: string): Promise<{
        items: {
            id: string;
            title: string;
            description: string;
            category: string;
            icon: string;
        }[];
        generatedAt: string;
    }>;
}
