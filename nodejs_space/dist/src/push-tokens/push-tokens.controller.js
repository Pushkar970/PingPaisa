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
exports.PushTokensController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const prisma_service_1 = require("../prisma/prisma.service");
const push_token_dto_1 = require("./dto/push-token.dto");
let PushTokensController = class PushTokensController {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async register(req, dto) {
        const user = req.user;
        await this.prisma.pushToken.upsert({
            where: { token: dto.token },
            update: { userId: user.id, deviceType: dto.deviceType },
            create: { token: dto.token, deviceType: dto.deviceType, userId: user.id },
        });
        return { success: true };
    }
    async remove(req, token) {
        const user = req.user;
        await this.prisma.pushToken.deleteMany({ where: { token, userId: user.id } });
        return { success: true };
    }
};
exports.PushTokensController = PushTokensController;
__decorate([
    (0, common_1.Post)(),
    openapi.ApiResponse({ status: 201, type: require("./dto/push-token.dto").PushTokenResponseDto }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, push_token_dto_1.CreatePushTokenDto]),
    __metadata("design:returntype", Promise)
], PushTokensController.prototype, "register", null);
__decorate([
    (0, common_1.Delete)(':token'),
    openapi.ApiResponse({ status: 200, type: require("./dto/push-token.dto").PushTokenResponseDto }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], PushTokensController.prototype, "remove", null);
exports.PushTokensController = PushTokensController = __decorate([
    (0, swagger_1.ApiTags)('Push Tokens'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('api/push-tokens'),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PushTokensController);
//# sourceMappingURL=push-tokens.controller.js.map