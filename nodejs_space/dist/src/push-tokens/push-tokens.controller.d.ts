import type { Request } from 'express';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePushTokenDto, PushTokenResponseDto } from './dto/push-token.dto';
export declare class PushTokensController {
    private prisma;
    constructor(prisma: PrismaService);
    register(req: Request, dto: CreatePushTokenDto): Promise<PushTokenResponseDto>;
    remove(req: Request, token: string): Promise<PushTokenResponseDto>;
}
