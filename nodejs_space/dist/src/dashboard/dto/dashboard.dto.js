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
exports.SplitResponseDto = exports.TrendsResponseDto = exports.TrendItemDto = exports.CategoryBreakdownResponseDto = exports.CategoryBreakdownItemDto = exports.DashboardStatsResponseDto = exports.TopCategoryDto = exports.BiggestSubscriptionDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
class BiggestSubscriptionDto {
    name;
    amount;
    static _OPENAPI_METADATA_FACTORY() {
        return { name: { required: true, type: () => String }, amount: { required: true, type: () => Number } };
    }
}
exports.BiggestSubscriptionDto = BiggestSubscriptionDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], BiggestSubscriptionDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], BiggestSubscriptionDto.prototype, "amount", void 0);
class TopCategoryDto {
    name;
    amount;
    static _OPENAPI_METADATA_FACTORY() {
        return { name: { required: true, type: () => String }, amount: { required: true, type: () => Number } };
    }
}
exports.TopCategoryDto = TopCategoryDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], TopCategoryDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], TopCategoryDto.prototype, "amount", void 0);
class DashboardStatsResponseDto {
    monthlySpend;
    yearlySpend;
    monthlyIncome;
    yearlyIncome;
    activeSubscriptionCount;
    biggestSubscription;
    topCategory;
    monthOverMonthChange;
    static _OPENAPI_METADATA_FACTORY() {
        return { monthlySpend: { required: true, type: () => Number }, yearlySpend: { required: true, type: () => Number }, monthlyIncome: { required: true, type: () => Number }, yearlyIncome: { required: true, type: () => Number }, activeSubscriptionCount: { required: true, type: () => Number }, biggestSubscription: { required: true, type: () => require("./dashboard.dto").BiggestSubscriptionDto, nullable: true }, topCategory: { required: true, type: () => require("./dashboard.dto").TopCategoryDto, nullable: true }, monthOverMonthChange: { required: true, type: () => Number } };
    }
}
exports.DashboardStatsResponseDto = DashboardStatsResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], DashboardStatsResponseDto.prototype, "monthlySpend", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], DashboardStatsResponseDto.prototype, "yearlySpend", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], DashboardStatsResponseDto.prototype, "monthlyIncome", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], DashboardStatsResponseDto.prototype, "yearlyIncome", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], DashboardStatsResponseDto.prototype, "activeSubscriptionCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ nullable: true, type: BiggestSubscriptionDto }),
    __metadata("design:type", Object)
], DashboardStatsResponseDto.prototype, "biggestSubscription", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ nullable: true, type: TopCategoryDto }),
    __metadata("design:type", Object)
], DashboardStatsResponseDto.prototype, "topCategory", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], DashboardStatsResponseDto.prototype, "monthOverMonthChange", void 0);
class CategoryBreakdownItemDto {
    category;
    amount;
    percentage;
    static _OPENAPI_METADATA_FACTORY() {
        return { category: { required: true, type: () => String }, amount: { required: true, type: () => Number }, percentage: { required: true, type: () => Number } };
    }
}
exports.CategoryBreakdownItemDto = CategoryBreakdownItemDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CategoryBreakdownItemDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CategoryBreakdownItemDto.prototype, "amount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CategoryBreakdownItemDto.prototype, "percentage", void 0);
class CategoryBreakdownResponseDto {
    items;
    static _OPENAPI_METADATA_FACTORY() {
        return { items: { required: true, type: () => [require("./dashboard.dto").CategoryBreakdownItemDto] } };
    }
}
exports.CategoryBreakdownResponseDto = CategoryBreakdownResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: [CategoryBreakdownItemDto] }),
    __metadata("design:type", Array)
], CategoryBreakdownResponseDto.prototype, "items", void 0);
class TrendItemDto {
    month;
    amount;
    static _OPENAPI_METADATA_FACTORY() {
        return { month: { required: true, type: () => String }, amount: { required: true, type: () => Number } };
    }
}
exports.TrendItemDto = TrendItemDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], TrendItemDto.prototype, "month", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], TrendItemDto.prototype, "amount", void 0);
class TrendsResponseDto {
    items;
    static _OPENAPI_METADATA_FACTORY() {
        return { items: { required: true, type: () => [require("./dashboard.dto").TrendItemDto] } };
    }
}
exports.TrendsResponseDto = TrendsResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: [TrendItemDto] }),
    __metadata("design:type", Array)
], TrendsResponseDto.prototype, "items", void 0);
class SplitResponseDto {
    subscriptionTotal;
    expenseTotal;
    month;
    static _OPENAPI_METADATA_FACTORY() {
        return { subscriptionTotal: { required: true, type: () => Number }, expenseTotal: { required: true, type: () => Number }, month: { required: true, type: () => String } };
    }
}
exports.SplitResponseDto = SplitResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], SplitResponseDto.prototype, "subscriptionTotal", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], SplitResponseDto.prototype, "expenseTotal", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], SplitResponseDto.prototype, "month", void 0);
//# sourceMappingURL=dashboard.dto.js.map