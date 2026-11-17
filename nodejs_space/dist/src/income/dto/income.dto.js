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
exports.IncomeListResponseDto = exports.BatchCreateIncomeResponseDto = exports.IncomeResponseDto = exports.BatchCreateIncomeDto = exports.ParseCreditSmsResponseDto = exports.ParsedIncomeItemDto = exports.ParseCreditSmsDto = exports.UpdateIncomeDto = exports.CreateIncomeDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class CreateIncomeDto {
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
exports.CreateIncomeDto = CreateIncomeDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateIncomeDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0.01),
    __metadata("design:type", Number)
], CreateIncomeDto.prototype, "amount", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateIncomeDto.prototype, "category", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateIncomeDto.prototype, "date", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateIncomeDto.prototype, "notes", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateIncomeDto.prototype, "source", void 0);
class UpdateIncomeDto {
    title;
    amount;
    category;
    date;
    notes;
    static _OPENAPI_METADATA_FACTORY() {
        return { title: { required: false, type: () => String }, amount: { required: false, type: () => Number }, category: { required: false, type: () => String }, date: { required: false, type: () => String }, notes: { required: false, type: () => String } };
    }
}
exports.UpdateIncomeDto = UpdateIncomeDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateIncomeDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateIncomeDto.prototype, "amount", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateIncomeDto.prototype, "category", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateIncomeDto.prototype, "date", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateIncomeDto.prototype, "notes", void 0);
class ParseCreditSmsDto {
    messages;
    static _OPENAPI_METADATA_FACTORY() {
        return { messages: { required: true, type: () => [String] } };
    }
}
exports.ParseCreditSmsDto = ParseCreditSmsDto;
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], ParseCreditSmsDto.prototype, "messages", void 0);
class ParsedIncomeItemDto {
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
exports.ParsedIncomeItemDto = ParsedIncomeItemDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ParsedIncomeItemDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ParsedIncomeItemDto.prototype, "amount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ParsedIncomeItemDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ParsedIncomeItemDto.prototype, "date", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ nullable: true }),
    __metadata("design:type", Object)
], ParsedIncomeItemDto.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ParsedIncomeItemDto.prototype, "originalSms", void 0);
class ParseCreditSmsResponseDto {
    parsed;
    total;
    failed;
    static _OPENAPI_METADATA_FACTORY() {
        return { parsed: { required: true, type: () => [require("./income.dto").ParsedIncomeItemDto] }, total: { required: true, type: () => Number }, failed: { required: true, type: () => Number } };
    }
}
exports.ParseCreditSmsResponseDto = ParseCreditSmsResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: [ParsedIncomeItemDto] }),
    __metadata("design:type", Array)
], ParseCreditSmsResponseDto.prototype, "parsed", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ParseCreditSmsResponseDto.prototype, "total", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ParseCreditSmsResponseDto.prototype, "failed", void 0);
class BatchCreateIncomeDto {
    incomes;
    static _OPENAPI_METADATA_FACTORY() {
        return { incomes: { required: true, type: () => [require("./income.dto").CreateIncomeDto] } };
    }
}
exports.BatchCreateIncomeDto = BatchCreateIncomeDto;
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => CreateIncomeDto),
    __metadata("design:type", Array)
], BatchCreateIncomeDto.prototype, "incomes", void 0);
class IncomeResponseDto {
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
exports.IncomeResponseDto = IncomeResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], IncomeResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], IncomeResponseDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], IncomeResponseDto.prototype, "amount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], IncomeResponseDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], IncomeResponseDto.prototype, "date", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ nullable: true }),
    __metadata("design:type", Object)
], IncomeResponseDto.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], IncomeResponseDto.prototype, "source", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], IncomeResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], IncomeResponseDto.prototype, "updatedAt", void 0);
class BatchCreateIncomeResponseDto {
    items;
    count;
    static _OPENAPI_METADATA_FACTORY() {
        return { items: { required: true, type: () => [require("./income.dto").IncomeResponseDto] }, count: { required: true, type: () => Number } };
    }
}
exports.BatchCreateIncomeResponseDto = BatchCreateIncomeResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: [IncomeResponseDto] }),
    __metadata("design:type", Array)
], BatchCreateIncomeResponseDto.prototype, "items", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], BatchCreateIncomeResponseDto.prototype, "count", void 0);
class IncomeListResponseDto {
    items;
    total;
    page;
    totalPages;
    static _OPENAPI_METADATA_FACTORY() {
        return { items: { required: true, type: () => [require("./income.dto").IncomeResponseDto] }, total: { required: true, type: () => Number }, page: { required: true, type: () => Number }, totalPages: { required: true, type: () => Number } };
    }
}
exports.IncomeListResponseDto = IncomeListResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: [IncomeResponseDto] }),
    __metadata("design:type", Array)
], IncomeListResponseDto.prototype, "items", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], IncomeListResponseDto.prototype, "total", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], IncomeListResponseDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], IncomeListResponseDto.prototype, "totalPages", void 0);
//# sourceMappingURL=income.dto.js.map