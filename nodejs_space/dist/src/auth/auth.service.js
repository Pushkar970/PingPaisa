"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var AuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const bcrypt = __importStar(require("bcryptjs"));
const crypto = __importStar(require("crypto"));
const prisma_service_1 = require("../prisma/prisma.service");
let AuthService = AuthService_1 = class AuthService {
    prisma;
    jwtService;
    configService;
    logger = new common_1.Logger(AuthService_1.name);
    constructor(prisma, jwtService, configService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.configService = configService;
    }
    async signup(email, password, name) {
        const existing = await this.prisma.user.findUnique({ where: { email } });
        if (existing) {
            throw new common_1.ConflictException('Email already in use');
        }
        const hashed = await bcrypt.hash(password, 10);
        const user = await this.prisma.user.create({
            data: {
                email,
                password: hashed,
                name,
                plan: {
                    create: { tier: 'FREE', aiQueriesUsed: 0, subscriptionCount: 0 },
                },
            },
        });
        const token = this.generateToken(user.id, user.email);
        return { token, user: { id: user.id, email: user.email, name: user.name } };
    }
    async login(email, password) {
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user || !user.password) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const token = this.generateToken(user.id, user.email);
        return { token, user: { id: user.id, email: user.email, name: user.name } };
    }
    async getMe(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { plan: true },
        });
        if (!user)
            throw new common_1.UnauthorizedException('User not found');
        return {
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                tier: user.plan?.tier ?? 'FREE',
                createdAt: user.createdAt.toISOString(),
            },
        };
    }
    generateToken(userId, email) {
        return this.jwtService.sign({ sub: userId, email });
    }
    getGoogleAuthUrl(redirectUri) {
        const clientId = this.configService.get('GOOGLE_CLIENT_ID') ?? 'PLACEHOLDER_CLIENT_ID';
        const appOrigin = (this.configService.get('APP_ORIGIN') ?? 'http://localhost:3000').replace(/\/$/, '');
        const callbackUrl = `${appOrigin}/api/auth/google/callback`;
        const secret = this.configService.getOrThrow('JWT_SECRET');
        const statePayload = JSON.stringify({ redirectUri, ts: Date.now() });
        const hmac = crypto.createHmac('sha256', secret).update(statePayload).digest('hex');
        const state = Buffer.from(JSON.stringify({ payload: statePayload, sig: hmac })).toString('base64url');
        const params = new URLSearchParams({
            client_id: clientId,
            redirect_uri: callbackUrl,
            response_type: 'code',
            scope: 'openid email profile',
            state,
            access_type: 'offline',
            prompt: 'consent',
        });
        return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
    }
    async handleGoogleCallback(code, stateStr) {
        const secret = this.configService.getOrThrow('JWT_SECRET');
        let redirectUri;
        try {
            const stateObj = JSON.parse(Buffer.from(stateStr, 'base64url').toString());
            const expectedHmac = crypto.createHmac('sha256', secret).update(stateObj.payload).digest('hex');
            if (expectedHmac !== stateObj.sig)
                throw new Error('Invalid state signature');
            const payload = JSON.parse(stateObj.payload);
            redirectUri = payload.redirectUri;
        }
        catch {
            throw new common_1.UnauthorizedException('Invalid state parameter');
        }
        const clientId = this.configService.get('GOOGLE_CLIENT_ID') ?? 'PLACEHOLDER_CLIENT_ID';
        const clientSecret = this.configService.get('GOOGLE_CLIENT_SECRET') ?? 'PLACEHOLDER_CLIENT_SECRET';
        const appOrigin = (this.configService.get('APP_ORIGIN') ?? 'http://localhost:3000').replace(/\/$/, '');
        const callbackUrl = `${appOrigin}/api/auth/google/callback`;
        const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                code,
                client_id: clientId,
                client_secret: clientSecret,
                redirect_uri: callbackUrl,
                grant_type: 'authorization_code',
            }),
        });
        const tokenData = await tokenRes.json();
        if (!tokenData.id_token)
            throw new common_1.UnauthorizedException('Failed to get Google token');
        const userInfoRes = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo`, {
            headers: { Authorization: `Bearer ${tokenData.access_token}` },
        });
        const userInfo = await userInfoRes.json();
        if (!userInfo.email)
            throw new common_1.UnauthorizedException('No email from Google');
        let user = await this.prisma.user.findUnique({ where: { email: userInfo.email } });
        if (!user) {
            user = await this.prisma.user.create({
                data: {
                    email: userInfo.email,
                    name: userInfo.name ?? userInfo.email.split('@')[0],
                    googleId: userInfo.sub,
                    plan: { create: { tier: 'FREE', aiQueriesUsed: 0, subscriptionCount: 0 } },
                },
            });
        }
        else if (!user.googleId) {
            user = await this.prisma.user.update({
                where: { id: user.id },
                data: { googleId: userInfo.sub },
            });
        }
        const token = this.generateToken(user.id, user.email);
        return { token, redirectUri, user: { id: user.id, email: user.email, name: user.name } };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map