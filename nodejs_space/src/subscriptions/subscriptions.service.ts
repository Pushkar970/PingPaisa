import { Injectable, ForbiddenException, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Decimal } from '@prisma/client/runtime/library';

function toSubResponse(sub: any) {
  return {
    id: sub.id,
    name: sub.name,
    category: sub.category,
    amount: sub.amount instanceof Decimal ? Number(sub.amount) : Number(sub.amount),
    currency: sub.currency,
    billingCycle: sub.billingCycle,
    nextRenewalDate: sub.nextRenewalDate instanceof Date ? sub.nextRenewalDate.toISOString() : sub.nextRenewalDate,
    reminderDaysBefore: sub.reminderDaysBefore ?? [],
    notes: sub.notes ?? null,
    createdAt: sub.createdAt instanceof Date ? sub.createdAt.toISOString() : sub.createdAt,
    updatedAt: sub.updatedAt instanceof Date ? sub.updatedAt.toISOString() : sub.updatedAt,
  };
}

@Injectable()
export class SubscriptionsService {
  private readonly logger = new Logger(SubscriptionsService.name);

  constructor(private prisma: PrismaService) {}

  async findAll(userId: string, page = 1, limit = 20) {
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

  async findUpcoming(userId: string, days: number) {
    const now = new Date();
    const future = new Date();
    future.setDate(future.getDate() + days);
    const items = await this.prisma.subscription.findMany({
      where: { userId, nextRenewalDate: { gte: now, lte: future } },
      orderBy: { nextRenewalDate: 'asc' },
    });
    return { items: items.map(toSubResponse) };
  }

  async findOne(userId: string, id: string) {
    const sub = await this.prisma.subscription.findFirst({ where: { id, userId } });
    if (!sub) throw new NotFoundException('Subscription not found');
    return toSubResponse(sub);
  }

  async create(userId: string, data: any) {
    const plan = await this.prisma.userPlan.findUnique({ where: { userId } });
    if (plan && plan.tier === 'FREE' && plan.subscriptionCount >= 5) {
      throw new ForbiddenException('Free tier limited to 5 subscriptions. Upgrade to Pro.');
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

  async update(userId: string, id: string, data: any) {
    const existing = await this.prisma.subscription.findFirst({ where: { id, userId } });
    if (!existing) throw new NotFoundException('Subscription not found');
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

  async remove(userId: string, id: string) {
    const existing = await this.prisma.subscription.findFirst({ where: { id, userId } });
    if (!existing) throw new NotFoundException('Subscription not found');
    await this.prisma.subscription.delete({ where: { id } });
    await this.prisma.userPlan.update({
      where: { userId },
      data: { subscriptionCount: { decrement: 1 } },
    });
    return { success: true };
  }
}
