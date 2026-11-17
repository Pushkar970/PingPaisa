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
exports.SuggestionsResponseDto = exports.SuggestionItemDto = exports.MessageListResponseDto = exports.ConversationListResponseDto = exports.ConversationSummaryDto = exports.ChatResponseDto = exports.ChatMessageDto = exports.ChatRequestDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class ChatRequestDto {
    message;
    conversationId;
    static _OPENAPI_METADATA_FACTORY() {
        return { message: { required: true, type: () => String }, conversationId: { required: false, type: () => String } };
    }
}
exports.ChatRequestDto = ChatRequestDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ChatRequestDto.prototype, "message", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ChatRequestDto.prototype, "conversationId", void 0);
class ChatMessageDto {
    id;
    role;
    content;
    createdAt;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, role: { required: true, type: () => String }, content: { required: true, type: () => String }, createdAt: { required: true, type: () => String } };
    }
}
exports.ChatMessageDto = ChatMessageDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ChatMessageDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ChatMessageDto.prototype, "role", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ChatMessageDto.prototype, "content", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ChatMessageDto.prototype, "createdAt", void 0);
class ChatResponseDto {
    conversationId;
    message;
    static _OPENAPI_METADATA_FACTORY() {
        return { conversationId: { required: true, type: () => String }, message: { required: true, type: () => require("./ai.dto").ChatMessageDto } };
    }
}
exports.ChatResponseDto = ChatResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ChatResponseDto.prototype, "conversationId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: ChatMessageDto }),
    __metadata("design:type", ChatMessageDto)
], ChatResponseDto.prototype, "message", void 0);
class ConversationSummaryDto {
    id;
    lastMessage;
    updatedAt;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, lastMessage: { required: true, type: () => String }, updatedAt: { required: true, type: () => String } };
    }
}
exports.ConversationSummaryDto = ConversationSummaryDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ConversationSummaryDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ConversationSummaryDto.prototype, "lastMessage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ConversationSummaryDto.prototype, "updatedAt", void 0);
class ConversationListResponseDto {
    items;
    static _OPENAPI_METADATA_FACTORY() {
        return { items: { required: true, type: () => [require("./ai.dto").ConversationSummaryDto] } };
    }
}
exports.ConversationListResponseDto = ConversationListResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: [ConversationSummaryDto] }),
    __metadata("design:type", Array)
], ConversationListResponseDto.prototype, "items", void 0);
class MessageListResponseDto {
    items;
    total;
    page;
    totalPages;
    static _OPENAPI_METADATA_FACTORY() {
        return { items: { required: true, type: () => [require("./ai.dto").ChatMessageDto] }, total: { required: true, type: () => Number }, page: { required: true, type: () => Number }, totalPages: { required: true, type: () => Number } };
    }
}
exports.MessageListResponseDto = MessageListResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: [ChatMessageDto] }),
    __metadata("design:type", Array)
], MessageListResponseDto.prototype, "items", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], MessageListResponseDto.prototype, "total", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], MessageListResponseDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], MessageListResponseDto.prototype, "totalPages", void 0);
class SuggestionItemDto {
    id;
    title;
    description;
    category;
    icon;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, title: { required: true, type: () => String }, description: { required: true, type: () => String }, category: { required: true, type: () => String }, icon: { required: true, type: () => String } };
    }
}
exports.SuggestionItemDto = SuggestionItemDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], SuggestionItemDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], SuggestionItemDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], SuggestionItemDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], SuggestionItemDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], SuggestionItemDto.prototype, "icon", void 0);
class SuggestionsResponseDto {
    items;
    generatedAt;
    static _OPENAPI_METADATA_FACTORY() {
        return { items: { required: true, type: () => [require("./ai.dto").SuggestionItemDto] }, generatedAt: { required: true, type: () => String } };
    }
}
exports.SuggestionsResponseDto = SuggestionsResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: [SuggestionItemDto] }),
    __metadata("design:type", Array)
], SuggestionsResponseDto.prototype, "items", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], SuggestionsResponseDto.prototype, "generatedAt", void 0);
//# sourceMappingURL=ai.dto.js.map