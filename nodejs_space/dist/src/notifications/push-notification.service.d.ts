import { OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
export declare class PushNotificationService implements OnModuleInit {
    private prisma;
    private readonly logger;
    private fcm?;
    private apnsJwt?;
    constructor(prisma: PrismaService);
    onModuleInit(): void;
    private apnsToken;
    sendAndroid(token: string, title: string, body: string, data?: Record<string, string>): Promise<void>;
    sendIos(deviceToken: string, title: string, body: string, data?: Record<string, any>): Promise<void>;
    sendToUser(userId: string, title: string, body: string, data?: Record<string, string>): Promise<void>;
}
