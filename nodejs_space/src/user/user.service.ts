import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(private prisma: PrismaService) {}

  /** Get total expenses for the current calendar month */
  private async getMonthlySpent(userId: string): Promise<number> {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const result = await this.prisma.expense.aggregate({
      where: { userId, date: { gte: monthStart, lt: monthEnd } },
      _sum: { amount: true },
    });

    const sum = result?._sum?.amount;
    return sum instanceof Decimal ? Number(sum) : Number(sum ?? 0);
  }

  async getPlan(userId: string) {
    const plan = await this.prisma.userPlan.findUnique({ where: { userId } });
    if (!plan) throw new NotFoundException('Plan not found');

    // Check and reset monthly counter
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

  async setMonthlyLimit(userId: string, limit: number | null) {
    await this.prisma.userPlan.update({
      where: { userId },
      data: { monthlyLimit: limit },
    });
    return { success: true, monthlyLimit: limit };
  }

  async upgrade(userId: string) {
    await this.prisma.userPlan.update({
      where: { userId },
      data: { tier: 'PRO' },
    });
    return { success: true, tier: 'PRO' };
  }
}
