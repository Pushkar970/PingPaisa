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
exports.IncomeController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const income_service_1 = require("./income.service");
const income_dto_1 = require("./dto/income.dto");
let IncomeController = class IncomeController {
    service;
    constructor(service) {
        this.service = service;
    }
    async findAll(req, page, limit, month, category) {
        const user = req.user;
        return this.service.findAll(user.id, page ?? 1, limit ?? 20, month, category);
    }
    async findOne(req, id) {
        const user = req.user;
        return this.service.findOne(user.id, id);
    }
    async parseCreditSms(dto) {
        return this.service.parseCreditSmsMessages(dto.messages);
    }
    async createBatch(req, dto) {
        const user = req.user;
        return this.service.createBatch(user.id, dto.incomes);
    }
    async create(req, dto) {
        const user = req.user;
        return this.service.create(user.id, dto);
    }
    async update(req, id, dto) {
        const user = req.user;
        return this.service.update(user.id, id, dto);
    }
    async remove(req, id) {
        const user = req.user;
        return this.service.remove(user.id, id);
    }
};
exports.IncomeController = IncomeController;
__decorate([
    openapi.ApiQuery({ name: "page", required: false }),
    openapi.ApiQuery({ name: "limit", required: false }),
    openapi.ApiQuery({ name: "month", required: false }),
    openapi.ApiQuery({ name: "category", required: false }),
    (0, common_1.Get)(),
    openapi.ApiResponse({ status: 200, type: require("./dto/income.dto").IncomeListResponseDto }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('page', new common_1.ParseIntPipe({ optional: true }))),
    __param(2, (0, common_1.Query)('limit', new common_1.ParseIntPipe({ optional: true }))),
    __param(3, (0, common_1.Query)('month')),
    __param(4, (0, common_1.Query)('category')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Number, String, String]),
    __metadata("design:returntype", Promise)
], IncomeController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    openapi.ApiResponse({ status: 200, type: require("./dto/income.dto").IncomeResponseDto }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], IncomeController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)('parse-credit-sms'),
    openapi.ApiResponse({ status: 201, type: require("./dto/income.dto").ParseCreditSmsResponseDto }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [income_dto_1.ParseCreditSmsDto]),
    __metadata("design:returntype", Promise)
], IncomeController.prototype, "parseCreditSms", null);
__decorate([
    (0, common_1.Post)('batch'),
    openapi.ApiResponse({ status: 201, type: require("./dto/income.dto").BatchCreateIncomeResponseDto }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, income_dto_1.BatchCreateIncomeDto]),
    __metadata("design:returntype", Promise)
], IncomeController.prototype, "createBatch", null);
__decorate([
    (0, common_1.Post)(),
    openapi.ApiResponse({ status: 201, type: require("./dto/income.dto").IncomeResponseDto }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, income_dto_1.CreateIncomeDto]),
    __metadata("design:returntype", Promise)
], IncomeController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    openapi.ApiResponse({ status: 200, type: require("./dto/income.dto").IncomeResponseDto }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, income_dto_1.UpdateIncomeDto]),
    __metadata("design:returntype", Promise)
], IncomeController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    openapi.ApiResponse({ status: 200, type: require("../subscriptions/dto/subscription.dto").DeleteResponseDto }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], IncomeController.prototype, "remove", null);
exports.IncomeController = IncomeController = __decorate([
    (0, swagger_1.ApiTags)('Income'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('api/income'),
    __metadata("design:paramtypes", [income_service_1.IncomeService])
], IncomeController);
//# sourceMappingURL=income.controller.js.map