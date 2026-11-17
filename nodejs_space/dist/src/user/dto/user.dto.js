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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MonthlyLimitResponseDto = exports.SetMonthlyLimitDto = exports.UpgradeResponseDto = exports.PlanResponseDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class PlanResponseDto {
    tier;
    aiQueriesUsed;
    aiQueriesLimit;
    subscriptionCount;
    subscriptionLimit;
    currentPeriodStart;
    monthlyLimit;
    monthlySpent;
    limitExceeded;
    static _OPENAPI_METADATA_FACTORY() {
        return { tier: { required: true, type: () => String }, aiQueriesUsed: { required: true, type: () => Number }, aiQueriesLimit: { required: true, type: () => Number }, subscriptionCount: { required: true, type: () => Number }, subscriptionLimit: { required: true, type: () => Number }, currentPeriodStart: { required: true, type: () => String }, monthlyLimit: { required: true, type: () => Number, nullable: true }, monthlySpent: { required: true, type: () => Number }, limitExceeded: { required: true, type: () => Boolean } };
    }
}
exports.PlanResponseDto = PlanResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], PlanResponseDto.prototype, "tier", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], PlanResponseDto.prototype, "aiQueriesUsed", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], PlanResponseDto.prototype, "aiQueriesLimit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], PlanResponseDto.prototype, "subscriptionCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], PlanResponseDto.prototype, "subscriptionLimit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], PlanResponseDto.prototype, "currentPeriodStart", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ nullable: true }),
    __metadata("design:type", Object)
], PlanResponseDto.prototype, "monthlyLimit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], PlanResponseDto.prototype, "monthlySpent", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], PlanResponseDto.prototype, "limitExceeded", void 0);
class UpgradeResponseDto {
    success;
    tier;
    static _OPENAPI_METADATA_FACTORY() {
        return { success: { required: true, type: () => Boolean }, tier: { required: true, type: () => String } };
    }
}
exports.UpgradeResponseDto = UpgradeResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], UpgradeResponseDto.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], UpgradeResponseDto.prototype, "tier", void 0);
class SetMonthlyLimitDto {
    limit;
    static _OPENAPI_METADATA_FACTORY() {
        return { limit: { required: true, type: () => Number, nullable: true, minimum: 0 } };
    }
}
exports.SetMonthlyLimitDto = SetMonthlyLimitDto;
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Object)
], SetMonthlyLimitDto.prototype, "limit", void 0);
class MonthlyLimitResponseDto {
    success;
    monthlyLimit;
    static _OPENAPI_METADATA_FACTORY() {
        return { success: { required: true, type: () => Boolean }, monthlyLimit: { required: true, type: () => Number, nullable: true } };
    }
}
exports.MonthlyLimitResponseDto = MonthlyLimitResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], MonthlyLimitResponseDto.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ nullable: true }),
    __metadata("design:type", Object)
], MonthlyLimitResponseDto.prototype, "monthlyLimit", void 0);
//# sourceMappingURL=user.dto.js.map