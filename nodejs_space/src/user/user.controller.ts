import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserService } from './user.service';
import { PlanResponseDto, UpgradeResponseDto, SetMonthlyLimitDto, MonthlyLimitResponseDto } from './dto/user.dto';

@ApiTags('User')
@UseGuards(JwtAuthGuard)
@Controller('api/user')
export class UserController {
  constructor(private service: UserService) {}

  @Get('plan')
  async getPlan(@Req() req: Request): Promise<PlanResponseDto> {
    const user = req.user as { id: string };
    return this.service.getPlan(user.id);
  }

  @Post('monthly-limit')
  async setMonthlyLimit(@Req() req: Request, @Body() dto: SetMonthlyLimitDto): Promise<MonthlyLimitResponseDto> {
    const user = req.user as { id: string };
    return this.service.setMonthlyLimit(user.id, dto.limit);
  }

  @Post('upgrade')
  async upgrade(@Req() req: Request): Promise<UpgradeResponseDto> {
    const user = req.user as { id: string };
    return this.service.upgrade(user.id);
  }
}
