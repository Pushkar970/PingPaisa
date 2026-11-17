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
var ExpensesService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpensesService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const prisma_service_1 = require("../prisma/prisma.service");
const library_1 = require("@prisma/client/runtime/library");
function toExpenseResponse(e) {
    return {
        id: e.id,
        title: e.title,
        amount: e.amount instanceof library_1.Decimal ? Number(e.amount) : Number(e.amount),
        category: e.category,
        date: e.date instanceof Date ? e.date.toISOString() : e.date,
        notes: e.notes ?? null,
        source: e.source ?? 'manual',
        createdAt: e.createdAt instanceof Date ? e.createdAt.toISOString() : e.createdAt,
        updatedAt: e.updatedAt instanceof Date ? e.updatedAt.toISOString() : e.updatedAt,
    };
}
let ExpensesService = ExpensesService_1 = class ExpensesService {
    prisma;
    configService;
    logger = new common_1.Logger(ExpensesService_1.name);
    constructor(prisma, configService) {
        this.prisma = prisma;
        this.configService = configService;
    }
    async findAll(userId, page = 1, limit = 20, month, category) {
        const where = { userId };
        if (month) {
            const [y, m] = month.split('-').map(Number);
            const start = new Date(y, m - 1, 1);
            const end = new Date(y, m, 1);
            where.date = { gte: start, lt: end };
        }
        if (category && category !== 'all') {
            where.category = category;
        }
        const skip = (page - 1) * limit;
        const [items, total] = await Promise.all([
            this.prisma.expense.findMany({ where, skip, take: limit, orderBy: { date: 'desc' } }),
            this.prisma.expense.count({ where }),
        ]);
        return {
            items: items.map(toExpenseResponse),
            total,
            page,
            totalPages: Math.ceil(total / limit),
        };
    }
    async findOne(userId, id) {
        const exp = await this.prisma.expense.findFirst({ where: { id, userId } });
        if (!exp)
            throw new common_1.NotFoundException('Expense not found');
        return toExpenseResponse(exp);
    }
    async create(userId, data) {
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
    async update(userId, id, data) {
        const existing = await this.prisma.expense.findFirst({ where: { id, userId } });
        if (!existing)
            throw new common_1.NotFoundException('Expense not found');
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
    async remove(userId, id) {
        const existing = await this.prisma.expense.findFirst({ where: { id, userId } });
        if (!existing)
            throw new common_1.NotFoundException('Expense not found');
        await this.prisma.expense.delete({ where: { id } });
        return { success: true };
    }
    async createBatch(userId, expenses) {
        const results = await this.prisma.$transaction(expenses.map((data) => this.prisma.expense.create({
            data: {
                userId,
                title: data.title,
                amount: data.amount,
                category: data.category,
                date: new Date(data.date),
                notes: data.notes ?? null,
                source: data.source ?? 'sms',
            },
        })));
        return { items: results.map(toExpenseResponse), count: results.length };
    }
    async parseSmsMessages(messages) {
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
            const apiKey = this.configService.get('ABACUSAI_API_KEY');
            const res = await fetch('https://apps.abacus.ai/v1/chat/completions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
                body: JSON.stringify({
                    messages: [{ role: 'user', content: prompt }],
                    response_format: { type: 'json_object' },
                    stream: false,
                }),
            });
            const data = await res.json();
            const content = data?.choices?.[0]?.message?.content;
            if (!content) {
                return { parsed: [], total: messages.length, failed: messages.length };
            }
            const result = JSON.parse(content);
            const transactions = Array.isArray(result?.transactions) ? result.transactions : [];
            const parsed = transactions
                .filter((t) => t?.amount && t?.title)
                .map((t) => ({
                title: String(t.title ?? 'Unknown'),
                amount: Number(t.amount),
                category: String(t.category ?? 'Other'),
                date: t.date ? new Date(t.date).toISOString() : new Date().toISOString(),
                notes: t.notes ?? null,
                originalSms: t.notes ?? '',
            }));
            return { parsed, total: messages.length, failed: messages.length - parsed.length };
        }
        catch (error) {
            this.logger.error('SMS parse error', error?.message);
            return { parsed: [], total: messages.length, failed: messages.length };
        }
    }
};
exports.ExpensesService = ExpensesService;
exports.ExpensesService = ExpensesService = ExpensesService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        config_1.ConfigService])
], ExpensesService);
//# sourceMappingURL=expenses.service.js.map