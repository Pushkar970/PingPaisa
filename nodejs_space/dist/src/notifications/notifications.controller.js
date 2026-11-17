"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var NotificationsController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const config_1 = require("@nestjs/config");
const prisma_service_1 = require("../prisma/prisma.service");
const push_notification_service_1 = require("./push-notification.service");
let NotificationsController = NotificationsController_1 = class NotificationsController {
    prisma;
    pushService;
    configService;
    logger = new common_1.Logger(NotificationsController_1.name);
    constructor(prisma, pushService, configService) {
        this.prisma = prisma;
        this.pushService = pushService;
        this.configService = configService;
    }
    async sendInactivityReminders(apiKey) {
        const expectedKey = this.configService.get('CRON_API_KEY');
        if (!expectedKey || apiKey !== expectedKey) {
            throw new common_1.UnauthorizedException('Invalid API key');
        }
        const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
        const usersWithTokens = await this.prisma.pushToken.findMany({
            select: { userId: true },
            distinct: ['userId'],
        });
        let notified = 0;
        let skipped = 0;
        for (const { userId } of usersWithTokens) {
            const latestExpense = await this.prisma.expense.findFirst({
                where: { userId },
                orderBy: { createdAt: 'desc' },
                select: { createdAt: true },
            });
            const latestSub = await this.prisma.subscription.findFirst({
                where: { userId },
                orderBy: { updatedAt: 'desc' },
                select: { updatedAt: true },
            });
            const lastActivity = [
                latestExpense?.createdAt,
                latestSub?.updatedAt,
            ]
                .filter(Boolean)
                .sort((a, b) => b.getTime() - a.getTime())[0];
            if (!lastActivity || lastActivity < twoDaysAgo) {
                try {
                    await this.pushService.sendToUser(userId, 'Time to track! \uD83D\uDCB0', 'Have any recent transactions? Tap to Smart Paste them from your bank SMS.', { screen: '/expense/smart-paste' });
                    notified++;
                }
                catch (e) {
                    this.logger.error(`Failed to notify user ${userId}: ${e?.message}`);
                    skipped++;
                }
            }
            else {
                skipped++;
            }
        }
        this.logger.log(`Inactivity reminders: ${notified} notified, ${skipped} skipped out of ${usersWithTokens.length}`);
        return {
            usersNotified: notified,
            usersSkipped: skipped,
            totalUsers: usersWithTokens.length,
        };
    }
};
exports.NotificationsController = NotificationsController;
__decorate([
    (0, common_1.Post)('send-inactivity-reminders'),
    openapi.ApiResponse({ status: 201, type: require("./dto/notification.dto").InactivityReminderResponseDto }),
    __param(0, (0, common_1.Headers)('x-api-key')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "sendInactivityReminders", null);
exports.NotificationsController = NotificationsController = NotificationsController_1 = __decorate([
    (0, swagger_1.ApiTags)('Notifications'),
    (0, common_1.Controller)('api/notifications'),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        push_notification_service_1.PushNotificationService,
        config_1.ConfigService])
], NotificationsController);
//# sourceMappingURL=notifications.controller.js.map