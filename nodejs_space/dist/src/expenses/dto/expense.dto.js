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
exports.ExpenseListResponseDto = exports.BatchCreateResponseDto = exports.ExpenseResponseDto = exports.BatchCreateExpenseDto = exports.ParseSmsResponseDto = exports.ParsedExpenseItemDto = exports.ParseSmsDto = exports.UpdateExpenseDto = exports.CreateExpenseDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class CreateExpenseDto {
    title;
    amount;
    category;
    date;
    notes;
    source;
    static _OPENAPI_METADATA_FACTORY() {
        return { title: { required: true, type: () => String }, amount: { required: true, type: () => Number, minimum: 0.01 }, category: { required: true, type: () => String }, date: { required: true, type: () => String }, notes: { required: false, type: () => String }, source: { required: false, type: () => String } };
    }
}
exports.CreateExpenseDto = CreateExpenseDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateExpenseDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0.01),
    __metadata("design:type", Number)
], CreateExpenseDto.prototype, "amount", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateExpenseDto.prototype, "category", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateExpenseDto.prototype, "date", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateExpenseDto.prototype, "notes", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateExpenseDto.prototype, "source", void 0);
class UpdateExpenseDto {
    title;
    amount;
    category;
    date;
    notes;
    static _OPENAPI_METADATA_FACTORY() {
        return { title: { required: false, type: () => String }, amount: { required: false, type: () => Number }, category: { required: false, type: () => String }, date: { required: false, type: () => String }, notes: { required: false, type: () => String } };
    }
}
exports.UpdateExpenseDto = UpdateExpenseDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateExpenseDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateExpenseDto.prototype, "amount", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateExpenseDto.prototype, "category", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateExpenseDto.prototype, "date", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateExpenseDto.prototype, "notes", void 0);
class ParseSmsDto {
    messages;
    static _OPENAPI_METADATA_FACTORY() {
        return { messages: { required: true, type: () => [String] } };
    }
}
exports.ParseSmsDto = ParseSmsDto;
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], ParseSmsDto.prototype, "messages", void 0);
class ParsedExpenseItemDto {
    title;
    amount;
    category;
    date;
    notes;
    originalSms;
    static _OPENAPI_METADATA_FACTORY() {
        return { title: { required: true, type: () => String }, amount: { required: true, type: () => Number }, category: { required: true, type: () => String }, date: { required: true, type: () => String }, notes: { required: true, type: () => String, nullable: true }, originalSms: { required: true, type: () => String } };
    }
}
exports.ParsedExpenseItemDto = ParsedExpenseItemDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ParsedExpenseItemDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ParsedExpenseItemDto.prototype, "amount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ParsedExpenseItemDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ParsedExpenseItemDto.prototype, "date", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ nullable: true }),
    __metadata("design:type", Object)
], ParsedExpenseItemDto.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ParsedExpenseItemDto.prototype, "originalSms", void 0);
class ParseSmsResponseDto {
    parsed;
    total;
    failed;
    static _OPENAPI_METADATA_FACTORY() {
        return { parsed: { required: true, type: () => [require("./expense.dto").ParsedExpenseItemDto] }, total: { required: true, type: () => Number }, failed: { required: true, type: () => Number } };
    }
}
exports.ParseSmsResponseDto = ParseSmsResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: [ParsedExpenseItemDto] }),
    __metadata("design:type", Array)
], ParseSmsResponseDto.prototype, "parsed", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ParseSmsResponseDto.prototype, "total", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ParseSmsResponseDto.prototype, "failed", void 0);
class BatchCreateExpenseDto {
    expenses;
    static _OPENAPI_METADATA_FACTORY() {
        return { expenses: { required: true, type: () => [require("./expense.dto").CreateExpenseDto] } };
    }
}
exports.BatchCreateExpenseDto = BatchCreateExpenseDto;
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => CreateExpenseDto),
    __metadata("design:type", Array)
], BatchCreateExpenseDto.prototype, "expenses", void 0);
class ExpenseResponseDto {
    id;
    title;
    amount;
    category;
    date;
    notes;
    source;
    createdAt;
    updatedAt;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, title: { required: true, type: () => String }, amount: { required: true, type: () => Number }, category: { required: true, type: () => String }, date: { required: true, type: () => String }, notes: { required: true, type: () => String, nullable: true }, source: { required: true, type: () => String }, createdAt: { required: true, type: () => String }, updatedAt: { required: true, type: () => String } };
    }
}
exports.ExpenseResponseDto = ExpenseResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ExpenseResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ExpenseResponseDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ExpenseResponseDto.prototype, "amount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ExpenseResponseDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ExpenseResponseDto.prototype, "date", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ nullable: true }),
    __metadata("design:type", Object)
], ExpenseResponseDto.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ExpenseResponseDto.prototype, "source", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ExpenseResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ExpenseResponseDto.prototype, "updatedAt", void 0);
class BatchCreateResponseDto {
    items;
    count;
    static _OPENAPI_METADATA_FACTORY() {
        return { items: { required: true, type: () => [require("./expense.dto").ExpenseResponseDto] }, count: { required: true, type: () => Number } };
    }
}
exports.BatchCreateResponseDto = BatchCreateResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: [ExpenseResponseDto] }),
    __metadata("design:type", Array)
], BatchCreateResponseDto.prototype, "items", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], BatchCreateResponseDto.prototype, "count", void 0);
class ExpenseListResponseDto {
    items;
    total;
    page;
    totalPages;
    static _OPENAPI_METADATA_FACTORY() {
        return { items: { required: true, type: () => [require("./expense.dto").ExpenseResponseDto] }, total: { required: true, type: () => Number }, page: { required: true, type: () => Number }, totalPages: { required: true, type: () => Number } };
    }
}
exports.ExpenseListResponseDto = ExpenseListResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: [ExpenseResponseDto] }),
    __metadata("design:type", Array)
], ExpenseListResponseDto.prototype, "items", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ExpenseListResponseDto.prototype, "total", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ExpenseListResponseDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ExpenseListResponseDto.prototype, "totalPages", void 0);
//# sourceMappingURL=expense.dto.js.map