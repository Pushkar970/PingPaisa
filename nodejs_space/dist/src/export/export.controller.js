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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExportController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const prisma_service_1 = require("../prisma/prisma.service");
const library_1 = require("@prisma/client/runtime/library");
let ExportController = class ExportController {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async exportCsv(req, res, type, month) {
        const user = req.user;
        const plan = await this.prisma.userPlan.findUnique({ where: { userId: user.id } });
        if (!plan || plan.tier !== 'PRO') {
            throw new common_1.ForbiddenException('CSV export is a Pro feature. Upgrade to Pro.');
        }
        const exportType = type ?? 'all';
        let csv = '';
        if (exportType === 'subscriptions' || exportType === 'all') {
            const subs = await this.prisma.subscription.findMany({ where: { userId: user.id } });
            csv += 'Type,Name,Category,Amount,Currency,BillingCycle,NextRenewalDate\n';
            subs.forEach((s) => {
                const amt = s.amount instanceof library_1.Decimal ? Number(s.amount) : Number(s.amount);
                csv += `Subscription,"${s.name}","${s.category}",${amt},${s.currency},${s.billingCycle},${s.nextRenewalDate.toISOString().split('T')[0]}\n`;
            });
        }
        if (exportType === 'expenses' || exportType === 'all') {
            const where = { userId: user.id };
            if (month) {
                const [y, m] = month.split('-').map(Number);
                where.date = { gte: new Date(y, m - 1, 1), lt: new Date(y, m, 1) };
            }
            const expenses = await this.prisma.expense.findMany({ where, orderBy: { date: 'desc' } });
            if (exportType === 'all' && csv)
                csv += '\n';
            csv += 'Type,Title,Category,Amount,Date\n';
            expenses.forEach((e) => {
                const amt = e.amount instanceof library_1.Decimal ? Number(e.amount) : Number(e.amount);
                csv += `Expense,"${e.title}","${e.category}",${amt},${e.date.toISOString().split('T')[0]}\n`;
            });
        }
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename="export.csv"');
        res.send(csv);
    }
};
exports.ExportController = ExportController;
__decorate([
    openapi.ApiQuery({ name: "type", required: false }),
    openapi.ApiQuery({ name: "month", required: false }),
    (0, common_1.Get)('csv'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Query)('type')),
    __param(3, (0, common_1.Query)('month')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String, String]),
    __metadata("design:returntype", Promise)
], ExportController.prototype, "exportCsv", null);
exports.ExportController = ExportController = __decorate([
    (0, swagger_1.ApiTags)('Export'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('api/export'),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ExportController);
//# sourceMappingURL=export.controller.js.map