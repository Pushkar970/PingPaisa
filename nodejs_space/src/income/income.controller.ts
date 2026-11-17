import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards, Req, ParseIntPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { IncomeService } from './income.service';
import { CreateIncomeDto, UpdateIncomeDto, IncomeResponseDto, IncomeListResponseDto, ParseCreditSmsDto, ParseCreditSmsResponseDto, BatchCreateIncomeDto, BatchCreateIncomeResponseDto } from './dto/income.dto';
import { DeleteResponseDto } from '../subscriptions/dto/subscription.dto';

@ApiTags('Income')
@UseGuards(JwtAuthGuard)
@Controller('api/income')
export class IncomeController {
  constructor(private service: IncomeService) {}

  @Get()
  async findAll(
    @Req() req: Request,
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
    @Query('month') month?: string,
    @Query('category') category?: string,
  ): Promise<IncomeListResponseDto> {
    const user = req.user as { id: string };
    return this.service.findAll(user.id, page ?? 1, limit ?? 20, month, category);
  }

  @Get(':id')
  async findOne(@Req() req: Request, @Param('id') id: string): Promise<IncomeResponseDto> {
    const user = req.user as { id: string };
    return this.service.findOne(user.id, id);
  }

  @Post('parse-credit-sms')
  async parseCreditSms(@Body() dto: ParseCreditSmsDto): Promise<ParseCreditSmsResponseDto> {
    return this.service.parseCreditSmsMessages(dto.messages);
  }

  @Post('batch')
  async createBatch(@Req() req: Request, @Body() dto: BatchCreateIncomeDto): Promise<BatchCreateIncomeResponseDto> {
    const user = req.user as { id: string };
    return this.service.createBatch(user.id, dto.incomes);
  }

  @Post()
  async create(@Req() req: Request, @Body() dto: CreateIncomeDto): Promise<IncomeResponseDto> {
    const user = req.user as { id: string };
    return this.service.create(user.id, dto);
  }

  @Patch(':id')
  async update(@Req() req: Request, @Param('id') id: string, @Body() dto: UpdateIncomeDto): Promise<IncomeResponseDto> {
    const user = req.user as { id: string };
    return this.service.update(user.id, id, dto);
  }

  @Delete(':id')
  async remove(@Req() req: Request, @Param('id') id: string): Promise<DeleteResponseDto> {
    const user = req.user as { id: string };
    return this.service.remove(user.id, id);
  }
}
