import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { Decimal } from '@prisma/client/runtime/library';
import { callLlmCompletion } from '../common/llm.util';

function toExpenseResponse(e: any) {
  return {
    id: e.id,
    title: e.title,
    amount: e.amount instanceof Decimal ? Number(e.amount) : Number(e.amount),
    category: e.category,
    date: e.date instanceof Date ? e.date.toISOString() : e.date,
    notes: e.notes ?? null,
    source: e.source ?? 'manual',
    createdAt: e.createdAt instanceof Date ? e.createdAt.toISOString() : e.createdAt,
    updatedAt: e.updatedAt instanceof Date ? e.updatedAt.toISOString() : e.updatedAt,
  };
}

@Injectable()
export class ExpensesService {
  private readonly logger = new Logger(ExpensesService.name);

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}

  async findAll(userId: string, page = 1, limit = 20, month?: string, category?: string) {
    const safePage = Math.max(1, Number(page) || 1);
    const safeLimit = Math.min(100, Math.max(1, Number(limit) || 20));
    const where: any = { userId };
    if (month) {
      if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(month)) {
        throw new BadRequestException('Invalid month format. Expected YYYY-MM.');
      }
      const [y, m] = month.split('-').map(Number);
      const start = new Date(Date.UTC(y, m - 1, 1));
      const end = new Date(Date.UTC(y, m, 1));
      where.date = { gte: start, lt: end };
    }
    if (category && category !== 'all') {
      where.category = category;
    }
    const skip = (safePage - 1) * safeLimit;
    const [items, total] = await Promise.all([
      this.prisma.expense.findMany({ where, skip, take: safeLimit, orderBy: { date: 'desc' } }),
      this.prisma.expense.count({ where }),
    ]);
    return {
      items: items.map(toExpenseResponse),
      total,
      page: safePage,
      totalPages: Math.ceil(total / safeLimit),
    };
  }

  async findOne(userId: string, id: string) {
    const exp = await this.prisma.expense.findFirst({ where: { id, userId } });
    if (!exp) throw new NotFoundException('Expense not found');
    return toExpenseResponse(exp);
  }

  async create(userId: string, data: any) {
    const exp = await this.prisma.expense.create({
      data: {
        userId,
        title: data.title,
        amount: data.amount,
        category: data.category,
        date: new Date(data.date),
        notes: data.notes ?? null,
        source: data.source ?? 'manual',
      },
    });
    return toExpenseResponse(exp);
  }

  async update(userId: string, id: string, data: any) {
    const existing = await this.prisma.expense.findFirst({ where: { id, userId } });
    if (!existing) throw new NotFoundException('Expense not found');
    const updated = await this.prisma.expense.update({
      where: { id },
      data: {
        ...(data.title !== undefined && { title: data.title }),
        ...(data.amount !== undefined && { amount: data.amount }),
        ...(data.category !== undefined && { category: data.category }),
        ...(data.date !== undefined && { date: new Date(data.date) }),
        ...(data.notes !== undefined && { notes: data.notes }),
      },
    });
    return toExpenseResponse(updated);
  }

  async remove(userId: string, id: string) {
    const existing = await this.prisma.expense.findFirst({ where: { id, userId } });
    if (!existing) throw new NotFoundException('Expense not found');
    await this.prisma.expense.delete({ where: { id } });
    return { success: true };
  }

  async createBatch(userId: string, expenses: any[]) {
    const results = await this.prisma.$transaction(
      expenses.map((data) =>
        this.prisma.expense.create({
          data: {
            userId,
            title: data.title,
            amount: data.amount,
            category: data.category,
            date: new Date(data.date),
            notes: data.notes ?? null,
            source: data.source ?? 'sms',
          },
        }),
      ),
    );
    return { items: results.map(toExpenseResponse), count: results.length };
  }

  async parseSmsMessages(messages: string[]) {
    const today = new Date().toISOString().split('T')[0];
    const prompt = `You are a bank transaction SMS parser. Parse each SMS message and extract transaction details.

For each SMS, return a JSON object with:
- title: merchant/payee name or description (e.g. "Amazon", "Swiggy", "Uber", "ATM Withdrawal")
- amount: the transaction amount as a number (no currency symbols)
- category: one of [Streaming, SaaS, Groceries, Transport, Dining, Shopping, Bills, Health, Travel, Entertainment, Education, Fitness, UPI, ATM, Transfer, Other]
- date: transaction date in YYYY-MM-DD format. If not in the SMS, use "${today}"
- notes: the original SMS text (keep for reference)

IMPORTANT: Only parse DEBIT/PAYMENT/SPENT messages. Skip credit/received/refund messages.
If a message is not a valid transaction SMS, skip it entirely.

Respond with a JSON object: { "transactions": [...] }
If no valid transactions found, return { "transactions": [] }

SMS messages to parse:
${messages.map((m, i) => `[${i + 1}] ${m}`).join('\n')}`;

    try {
      const content = await callLlmCompletion(this.configService, {
        messages: [{ role: 'user', content: prompt }],
        jsonMode: true,
      });
      if (!content) {
        return { parsed: [], total: messages.length, failed: messages.length };
      }
      const result = JSON.parse(content);
      const transactions = Array.isArray(result?.transactions) ? result.transactions : [];
      const parsed = transactions
        .filter((t: any) => Number(t?.amount) > 0 && t?.title)
        .map((t: any) => {
          const parsedDate = t.date ? new Date(t.date) : new Date();
          const safeDate = isNaN(parsedDate.getTime()) ? new Date() : parsedDate;
          return {
            title: String(t.title ?? 'Unknown'),
            amount: Number(t.amount),
            category: String(t.category ?? 'Other'),
            date: safeDate.toISOString(),
            notes: t.notes ?? null,
            originalSms: t.notes ?? '',
          };
        });
      return { parsed, total: messages.length, failed: messages.length - parsed.length };
    } catch (error: any) {
      this.logger.error('SMS parse error', error?.message);
      return { parsed: [], total: messages.length, failed: messages.length };
    }
  }
}
