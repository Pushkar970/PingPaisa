import { Controller, Get, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { DashboardService } from './dashboard.service';
import { DashboardStatsResponseDto, CategoryBreakdownResponseDto, TrendsResponseDto, SplitResponseDto } from './dto/dashboard.dto';

@ApiTags('Dashboard')
@UseGuards(JwtAuthGuard)
@Controller('api/dashboard')
export class DashboardController {
  constructor(private service: DashboardService) {}

  @Get('stats')
  async getStats(@Req() req: Request): Promise<DashboardStatsResponseDto> {
    const user = req.user as { id: string };
    return this.service.getStats(user.id);
  }

  @Get('category-breakdown')
  async getCategoryBreakdown(@Req() req: Request, @Query('period') period?: string): Promise<CategoryBreakdownResponseDto> {
    const user = req.user as { id: string };
    return this.service.getCategoryBreakdown(user.id, period ?? 'month');
  }

  @Get('trends')
  async getTrends(@Req() req: Request): Promise<TrendsResponseDto> {
    const user = req.user as { id: string };
    return this.service.getTrends(user.id);
  }

  @Get('split')
  async getSplit(@Req() req: Request): Promise<SplitResponseDto> {
    const user = req.user as { id: string };
    return this.service.getSplit(user.id);
  }
}
