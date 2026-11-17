import type { Request } from 'express';
import { DashboardService } from './dashboard.service';
import { DashboardStatsResponseDto, CategoryBreakdownResponseDto, TrendsResponseDto, SplitResponseDto } from './dto/dashboard.dto';
export declare class DashboardController {
    private service;
    constructor(service: DashboardService);
    getStats(req: Request): Promise<DashboardStatsResponseDto>;
    getCategoryBreakdown(req: Request, period?: string): Promise<CategoryBreakdownResponseDto>;
    getTrends(req: Request): Promise<TrendsResponseDto>;
    getSplit(req: Request): Promise<SplitResponseDto>;
}
