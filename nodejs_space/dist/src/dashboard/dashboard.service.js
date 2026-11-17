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
var DashboardService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const library_1 = require("@prisma/client/runtime/library");
function toNum(v) {
    if (v instanceof library_1.Decimal)
        return Number(v);
    return Number(v ?? 0);
}
function prorateMonthly(amount, cycle) {
    if (cycle === 'weekly')
        return amount * 4.33;
    if (cycle === 'yearly')
        return amount / 12;
    return amount;
}
function prorateYearly(amount, cycle) {
    if (cycle === 'weekly')
        return amount * 52;
    if (cycle === 'monthly')
        return amount * 12;
    return amount;
}
let DashboardService = DashboardService_1 = class DashboardService {
    prisma;
    logger = new common_1.Logger(DashboardService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getStats(userId) {
        const now = new Date();
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1);
        const yearStart = new Date(now.getFullYear(), 0, 1);
        const yearEnd = new Date(now.getFullYear() + 1, 0, 1);
        const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const prevMonthEnd = monthStart;
        const [subs, monthExpenses, yearExpenses, prevMonthExpenses, monthIncomes, yearIncomes] = await Promise.all([
            this.prisma.subscription.findMany({ where: { userId } }),
            this.prisma.expense.findMany({ where: { userId, date: { gte: monthStart, lt: monthEnd } } }),
            this.prisma.expense.findMany({ where: { userId, date: { gte: yearStart, lt: yearEnd } } }),
            this.prisma.expense.findMany({ where: { userId, date: { gte: prevMonthStart, lt: prevMonthEnd } } }),
            this.prisma.income.findMany({ where: { userId, date: { gte: monthStart, lt: monthEnd } } }),
            this.prisma.income.findMany({ where: { userId, date: { gte: yearStart, lt: yearEnd } } }),
        ]);
        const subMonthly = subs.reduce((acc, s) => acc + prorateMonthly(toNum(s.amount), s.billingCycle), 0);
        const subYearly = subs.reduce((acc, s) => acc + prorateYearly(toNum(s.amount), s.billingCycle), 0);
        const expMonthly = monthExpenses.reduce((acc, e) => acc + toNum(e.amount), 0);
        const expYearly = yearExpenses.reduce((acc, e) => acc + toNum(e.amount), 0);
        const prevExpMonthly = prevMonthExpenses.reduce((acc, e) => acc + toNum(e.amount), 0);
        const incMonthly = monthIncomes.reduce((acc, e) => acc + toNum(e.amount), 0);
        const incYearly = yearIncomes.reduce((acc, e) => acc + toNum(e.amount), 0);
        const monthlySpend = Math.round((subMonthly + expMonthly) * 100) / 100;
        const yearlySpend = Math.round((subYearly + expYearly) * 100) / 100;
        const monthlyIncome = Math.round(incMonthly * 100) / 100;
        const yearlyIncome = Math.round(incYearly * 100) / 100;
        const prevTotal = subMonthly + prevExpMonthly;
        const monthOverMonthChange = prevTotal > 0 ? Math.round(((monthlySpend - prevTotal) / prevTotal) * 10000) / 100 : 0;
        let biggestSubscription = null;
        if (subs.length > 0) {
            const biggest = subs.reduce((max, s) => (toNum(s.amount) > toNum(max.amount) ? s : max), subs[0]);
            biggestSubscription = { name: biggest.name, amount: toNum(biggest.amount) };
        }
        const allItems = [
            ...subs.map((s) => ({ category: s.category, amount: prorateMonthly(toNum(s.amount), s.billingCycle) })),
            ...monthExpenses.map((e) => ({ category: e.category, amount: toNum(e.amount) })),
        ];
        const catMap = new Map();
        allItems.forEach((i) => catMap.set(i.category, (catMap.get(i.category) ?? 0) + i.amount));
        let topCategory = null;
        if (catMap.size > 0) {
            let maxKey = '';
            let maxVal = 0;
            catMap.forEach((v, k) => {
                if (v > maxVal) {
                    maxKey = k;
                    maxVal = v;
                }
            });
            topCategory = { name: maxKey, amount: Math.round(maxVal * 100) / 100 };
        }
        return { monthlySpend, yearlySpend, monthlyIncome, yearlyIncome, activeSubscriptionCount: subs.length, biggestSubscription, topCategory, monthOverMonthChange };
    }
    async getCategoryBreakdown(userId, period) {
        const now = new Date();
        let start;
        let end;
        if (period === 'year') {
            start = new Date(now.getFullYear(), 0, 1);
            end = new Date(now.getFullYear() + 1, 0, 1);
        }
        else {
            start = new Date(now.getFullYear(), now.getMonth(), 1);
            end = new Date(now.getFullYear(), now.getMonth() + 1, 1);
        }
        const [subs, expenses] = await Promise.all([
            this.prisma.subscription.findMany({ where: { userId } }),
            this.prisma.expense.findMany({ where: { userId, date: { gte: start, lt: end } } }),
        ]);
        const catMap = new Map();
        const multiplier = period === 'year' ? 12 : 1;
        subs.forEach((s) => {
            const amt = prorateMonthly(toNum(s.amount), s.billingCycle) * multiplier;
            catMap.set(s.category, (catMap.get(s.category) ?? 0) + amt);
        });
        expenses.forEach((e) => {
            catMap.set(e.category, (catMap.get(e.category) ?? 0) + toNum(e.amount));
        });
        const total = Array.from(catMap.values()).reduce((a, b) => a + b, 0);
        const items = Array.from(catMap.entries()).map(([category, amount]) => ({
            category,
            amount: Math.round(amount * 100) / 100,
            percentage: total > 0 ? Math.round((amount / total) * 10000) / 100 : 0,
        })).sort((a, b) => b.amount - a.amount);
        return { items };
    }
    async getTrends(userId) {
        const now = new Date();
        const months = [];
        for (let i = 11; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const label = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
            months.push({ month: label, start: d, end: new Date(d.getFullYear(), d.getMonth() + 1, 1) });
        }
        const [subs, expenses] = await Promise.all([
            this.prisma.subscription.findMany({ where: { userId } }),
            this.prisma.expense.findMany({
                where: { userId, date: { gte: months[0].start, lt: months[months.length - 1].end } },
            }),
        ]);
        const subMonthly = subs.reduce((acc, s) => acc + prorateMonthly(toNum(s.amount), s.billingCycle), 0);
        const items = months.map(({ month, start, end }) => {
            const expTotal = expenses
                .filter((e) => e.date >= start && e.date < end)
                .reduce((acc, e) => acc + toNum(e.amount), 0);
            return { month, amount: Math.round((subMonthly + expTotal) * 100) / 100 };
        });
        return { items };
    }
    async getSplit(userId) {
        const now = new Date();
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1);
        const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
        const [subs, expenses] = await Promise.all([
            this.prisma.subscription.findMany({ where: { userId } }),
            this.prisma.expense.findMany({ where: { userId, date: { gte: monthStart, lt: monthEnd } } }),
        ]);
        const subscriptionTotal = Math.round(subs.reduce((acc, s) => acc + prorateMonthly(toNum(s.amount), s.billingCycle), 0) * 100) / 100;
        const expenseTotal = Math.round(expenses.reduce((acc, e) => acc + toNum(e.amount), 0) * 100) / 100;
        return { subscriptionTotal, expenseTotal, month };
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = DashboardService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map