import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
export declare class AuthService {
    private prisma;
    private jwtService;
    private configService;
    private readonly logger;
    constructor(prisma: PrismaService, jwtService: JwtService, configService: ConfigService);
    signup(email: string, password: string, name: string): Promise<{
        token: string;
        user: {
            id: string;
            email: string;
            name: string;
        };
    }>;
    login(email: string, password: string): Promise<{
        token: string;
        user: {
            id: string;
            email: string;
            name: string;
        };
    }>;
    getMe(userId: string): Promise<{
        user: {
            id: string;
            email: string;
            name: string;
            tier: string;
            createdAt: string;
        };
    }>;
    generateToken(userId: string, email: string): string;
    getGoogleAuthUrl(redirectUri: string): string;
    handleGoogleCallback(code: string, stateStr: string): Promise<{
        token: string;
        redirectUri: string;
        user: {
            id: string;
            email: string;
            name: string;
        };
    }>;
}
