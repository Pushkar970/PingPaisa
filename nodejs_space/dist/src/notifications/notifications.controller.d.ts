import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { PushNotificationService } from './push-notification.service';
import { InactivityReminderResponseDto } from './dto/notification.dto';
export declare class NotificationsController {
    private prisma;
    private pushService;
    private configService;
    private readonly logger;
    constructor(prisma: PrismaService, pushService: PushNotificationService, configService: ConfigService);
    sendInactivityReminders(apiKey: string): Promise<InactivityReminderResponseDto>;
}
