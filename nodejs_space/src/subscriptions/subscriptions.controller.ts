import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards, Req, ParseIntPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SubscriptionsService } from './subscriptions.service';
import { CreateSubscriptionDto, UpdateSubscriptionDto, SubscriptionResponseDto, SubscriptionListResponseDto, SubscriptionUpcomingResponseDto, DeleteResponseDto } from './dto/subscription.dto';

@ApiTags('Subscriptions')
@UseGuards(JwtAuthGuard)
@Controller('api/subscriptions')
export class SubscriptionsController {
  constructor(private service: SubscriptionsService) {}

  @Get()
  async findAll(
    @Req() req: Request,
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ): Promise<SubscriptionListResponseDto> {
    const user = req.user as { id: string };
    return this.service.findAll(user.id, page ?? 1, limit ?? 20);
  }

  @Get('upcoming')
  async findUpcoming(
    @Req() req: Request,
    @Query('days', new ParseIntPipe({ optional: true })) days?: number,
  ): Promise<SubscriptionUpcomingResponseDto> {
    const user = req.user as { id: string };
    return this.service.findUpcoming(user.id, days ?? 7);
  }

  @Get(':id')
  async findOne(@Req() req: Request, @Param('id') id: string): Promise<SubscriptionResponseDto> {
    const user = req.user as { id: string };
    return this.service.findOne(user.id, id);
  }

  @Post()
  async create(@Req() req: Request, @Body() dto: CreateSubscriptionDto): Promise<SubscriptionResponseDto> {
    const user = req.user as { id: string };
    return this.service.create(user.id, dto);
  }

  @Patch(':id')
  async update(@Req() req: Request, @Param('id') id: string, @Body() dto: UpdateSubscriptionDto): Promise<SubscriptionResponseDto> {
    const user = req.user as { id: string };
    return this.service.update(user.id, id, dto);
  }

  @Delete(':id')
  async remove(@Req() req: Request, @Param('id') id: string): Promise<DeleteResponseDto> {
    const user = req.user as { id: string };
    return this.service.remove(user.id, id);
  }
}
