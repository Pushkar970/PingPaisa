import { Controller, Get, Query, UseGuards, Req, Res, ForbiddenException } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import type { Request, Response } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PrismaService } from '../prisma/prisma.service';
import { Decimal } from '@prisma/client/runtime/library';

@ApiTags('Export')
@UseGuards(JwtAuthGuard)
@Controller('api/export')
export class ExportController {
  constructor(private prisma: PrismaService) {}

  @Get('csv')
  async exportCsv(
    @Req() req: Request,
    @Res() res: Response,
    @Query('type') type?: string,
    @Query('month') month?: string,
  ): Promise<void> {
    const user = req.user as { id: string };
    const plan = await this.prisma.userPlan.findUnique({ where: { userId: user.id } });
    if (!plan || plan.tier !== 'PRO') {
      throw new ForbiddenException('CSV export is a Pro feature. Upgrade to Pro.');
    }

    const exportType = type ?? 'all';
    let csv = '';

    if (exportType === 'subscriptions' || exportType === 'all') {
      const subs = await this.prisma.subscription.findMany({ where: { userId: user.id } });
      csv += 'Type,Name,Category,Amount,Currency,BillingCycle,NextRenewalDate\n';
      subs.forEach((s) => {
        const amt = s.amount instanceof Decimal ? Number(s.amount) : Number(s.amount);
        csv += `Subscription,"${s.name}","${s.category}",${amt},${s.currency},${s.billingCycle},${s.nextRenewalDate.toISOString().split('T')[0]}\n`;
      });
    }

    if (exportType === 'expenses' || exportType === 'all') {
      const where: any = { userId: user.id };
      if (month) {
        const [y, m] = month.split('-').map(Number);
        where.date = { gte: new Date(y, m - 1, 1), lt: new Date(y, m, 1) };
      }
      const expenses = await this.prisma.expense.findMany({ where, orderBy: { date: 'desc' } });
      if (exportType === 'all' && csv) csv += '\n';
      csv += 'Type,Title,Category,Amount,Date\n';
      expenses.forEach((e) => {
        const amt = e.amount instanceof Decimal ? Number(e.amount) : Number(e.amount);
        csv += `Expense,"${e.title}","${e.category}",${amt},${e.date.toISOString().split('T')[0]}\n`;
      });
    }

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="export.csv"');
    res.send(csv);
  }
}
