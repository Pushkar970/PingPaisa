import { Controller, Get, Query, UseGuards, Req, Res, ForbiddenException, BadRequestException } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import type { Request, Response } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PrismaService } from '../prisma/prisma.service';
import { Decimal } from '@prisma/client/runtime/library';

function csvCell(value: unknown): string {
  let str = String(value ?? '');
  if (/^[=+\-@\t\r]/.test(str)) {
    str = `'${str}`;
  }
  return `"${str.replace(/"/g, '""')}"`;
}

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
    if (!['all', 'subscriptions', 'expenses', 'income'].includes(exportType)) {
      throw new BadRequestException('Invalid export type.');
    }

    let dateRange: { gte: Date; lt: Date } | undefined;
    if (month) {
      if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(month)) {
        throw new BadRequestException('Invalid month format. Expected YYYY-MM.');
      }
      const [y, m] = month.split('-').map(Number);
      dateRange = { gte: new Date(Date.UTC(y, m - 1, 1)), lt: new Date(Date.UTC(y, m, 1)) };
    }

    let csv = '';

    if (exportType === 'subscriptions' || exportType === 'all') {
      const subs = await this.prisma.subscription.findMany({ where: { userId: user.id } });
      csv += 'Type,Name,Category,Amount,Currency,BillingCycle,NextRenewalDate\n';
      subs.forEach((s) => {
        const amt = s.amount instanceof Decimal ? Number(s.amount) : Number(s.amount);
        csv += `Subscription,${csvCell(s.name)},${csvCell(s.category)},${amt},${csvCell(s.currency)},${csvCell(s.billingCycle)},${s.nextRenewalDate.toISOString().split('T')[0]}\n`;
      });
    }

    if (exportType === 'expenses' || exportType === 'all') {
      const where: any = { userId: user.id };
      if (dateRange) where.date = dateRange;
      const expenses = await this.prisma.expense.findMany({ where, orderBy: { date: 'desc' } });
      if (csv) csv += '\n';
      csv += 'Type,Title,Category,Amount,Date\n';
      expenses.forEach((e) => {
        const amt = e.amount instanceof Decimal ? Number(e.amount) : Number(e.amount);
        csv += `Expense,${csvCell(e.title)},${csvCell(e.category)},${amt},${e.date.toISOString().split('T')[0]}\n`;
      });
    }

    if (exportType === 'income' || exportType === 'all') {
      const where: any = { userId: user.id };
      if (dateRange) where.date = dateRange;
      const incomes = await this.prisma.income.findMany({ where, orderBy: { date: 'desc' } });
      if (csv) csv += '\n';
      csv += 'Type,Title,Category,Amount,Date\n';
      incomes.forEach((inc) => {
        const amt = inc.amount instanceof Decimal ? Number(inc.amount) : Number(inc.amount);
        csv += `Income,${csvCell(inc.title)},${csvCell(inc.category)},${amt},${inc.date.toISOString().split('T')[0]}\n`;
      });
    }

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="export.csv"');
    res.send(csv);
  }
}
