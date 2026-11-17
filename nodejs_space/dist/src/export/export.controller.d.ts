import type { Request, Response } from 'express';
import { PrismaService } from '../prisma/prisma.service';
export declare class ExportController {
    private prisma;
    constructor(prisma: PrismaService);
    exportCsv(req: Request, res: Response, type?: string, month?: string): Promise<void>;
}
