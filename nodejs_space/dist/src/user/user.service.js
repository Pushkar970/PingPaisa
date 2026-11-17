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
var UserService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const library_1 = require("@prisma/client/runtime/library");
let UserService = UserService_1 = class UserService {
    prisma;
    logger = new common_1.Logger(UserService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getMonthlySpent(userId) {
        const now = new Date();
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1);
        const result = await this.prisma.expense.aggregate({
            where: { userId, date: { gte: monthStart, lt: monthEnd } },
            _sum: { amount: true },
        });
        const sum = result?._sum?.amount;
        return sum instanceof library_1.Decimal ? Number(sum) : Number(sum ?? 0);
    }
    async getPlan(userId) {
        const plan = await this.prisma.userPlan.findUnique({ where: { userId } });
        if (!plan)
            throw new common_1.NotFoundException('Plan not found');
        const periodStart = new Date(plan.currentPeriodStart);
        const daysSince = (Date.now() - periodStart.getTime()) / (1000 * 60 * 60 * 24);
        if (daysSince > 30) {
            await this.prisma.userPlan.update({
                where: { userId },
                data: { aiQueriesUsed: 0, currentPeriodStart: new Date() },
            });
            plan.aiQueriesUsed = 0;
        }
        const monthlySpent = await this.getMonthlySpent(userId);
        const monthlyLimit = plan.monthlyLimit != null ? Number(plan.monthlyLimit) : null;
        return {
            tier: plan.tier,
            aiQueriesUsed: plan.aiQueriesUsed,
            aiQueriesLimit: plan.tier === 'PRO' ? -1 : 10,
            subscriptionCount: plan.subscriptionCount,
            subscriptionLimit: plan.tier === 'PRO' ? -1 : 5,
            currentPeriodStart: plan.currentPeriodStart.toISOString(),
            monthlyLimit,
            monthlySpent,
            limitExceeded: monthlyLimit != null && monthlySpent > monthlyLimit,
        };
    }
    async setMonthlyLimit(userId, limit) {
        await this.prisma.userPlan.update({
            where: { userId },
            data: { monthlyLimit: limit },
        });
        return { success: true, monthlyLimit: limit };
    }
    async upgrade(userId) {
        await this.prisma.userPlan.update({
            where: { userId },
            data: { tier: 'PRO' },
        });
        return { success: true, tier: 'PRO' };
    }
};
exports.UserService = UserService;
exports.UserService = UserService = UserService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UserService);
//# sourceMappingURL=user.service.js.map