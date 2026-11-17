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
var SubscriptionsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const library_1 = require("@prisma/client/runtime/library");
function toSubResponse(sub) {
    return {
        id: sub.id,
        name: sub.name,
        category: sub.category,
        amount: sub.amount instanceof library_1.Decimal ? Number(sub.amount) : Number(sub.amount),
        currency: sub.currency,
        billingCycle: sub.billingCycle,
        nextRenewalDate: sub.nextRenewalDate instanceof Date ? sub.nextRenewalDate.toISOString() : sub.nextRenewalDate,
        reminderDaysBefore: sub.reminderDaysBefore ?? [],
        notes: sub.notes ?? null,
        createdAt: sub.createdAt instanceof Date ? sub.createdAt.toISOString() : sub.createdAt,
        updatedAt: sub.updatedAt instanceof Date ? sub.updatedAt.toISOString() : sub.updatedAt,
    };
}
let SubscriptionsService = SubscriptionsService_1 = class SubscriptionsService {
    prisma;
    logger = new common_1.Logger(SubscriptionsService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(userId, page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const [items, total] = await Promise.all([
            this.prisma.subscription.findMany({ where: { userId }, skip, take: limit, orderBy: { nextRenewalDate: 'asc' } }),
            this.prisma.subscription.count({ where: { userId } }),
        ]);
        return {
            items: items.map(toSubResponse),
            total,
            page,
            totalPages: Math.ceil(total / limit),
        };
    }
    async findUpcoming(userId, days) {
        const now = new Date();
        const future = new Date();
        future.setDate(future.getDate() + days);
        const items = await this.prisma.subscription.findMany({
            where: { userId, nextRenewalDate: { gte: now, lte: future } },
            orderBy: { nextRenewalDate: 'asc' },
        });
        return { items: items.map(toSubResponse) };
    }
    async findOne(userId, id) {
        const sub = await this.prisma.subscription.findFirst({ where: { id, userId } });
        if (!sub)
            throw new common_1.NotFoundException('Subscription not found');
        return toSubResponse(sub);
    }
    async create(userId, data) {
        const plan = await this.prisma.userPlan.findUnique({ where: { userId } });
        if (plan && plan.tier === 'FREE' && plan.subscriptionCount >= 5) {
            throw new common_1.ForbiddenException('Free tier limited to 5 subscriptions. Upgrade to Pro.');
        }
        const sub = await this.prisma.subscription.create({
            data: {
                userId,
                name: data.name,
                category: data.category,
                amount: data.amount,
                currency: data.currency ?? 'USD',
                billingCycle: data.billingCycle,
                nextRenewalDate: new Date(data.nextRenewalDate),
                reminderDaysBefore: data.reminderDaysBefore ?? [],
                notes: data.notes ?? null,
            },
        });
        if (plan) {
            await this.prisma.userPlan.update({
                where: { userId },
                data: { subscriptionCount: { increment: 1 } },
            });
        }
        return toSubResponse(sub);
    }
    async update(userId, id, data) {
        const existing = await this.prisma.subscription.findFirst({ where: { id, userId } });
        if (!existing)
            throw new common_1.NotFoundException('Subscription not found');
        const updated = await this.prisma.subscription.update({
            where: { id },
            data: {
                ...(data.name !== undefined && { name: data.name }),
                ...(data.category !== undefined && { category: data.category }),
                ...(data.amount !== undefined && { amount: data.amount }),
                ...(data.currency !== undefined && { currency: data.currency }),
                ...(data.billingCycle !== undefined && { billingCycle: data.billingCycle }),
                ...(data.nextRenewalDate !== undefined && { nextRenewalDate: new Date(data.nextRenewalDate) }),
                ...(data.reminderDaysBefore !== undefined && { reminderDaysBefore: data.reminderDaysBefore }),
                ...(data.notes !== undefined && { notes: data.notes }),
            },
        });
        return toSubResponse(updated);
    }
    async remove(userId, id) {
        const existing = await this.prisma.subscription.findFirst({ where: { id, userId } });
        if (!existing)
            throw new common_1.NotFoundException('Subscription not found');
        await this.prisma.subscription.delete({ where: { id } });
        await this.prisma.userPlan.update({
            where: { userId },
            data: { subscriptionCount: { decrement: 1 } },
        });
        return { success: true };
    }
};
exports.SubscriptionsService = SubscriptionsService;
exports.SubscriptionsService = SubscriptionsService = SubscriptionsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SubscriptionsService);
//# sourceMappingURL=subscriptions.service.js.map