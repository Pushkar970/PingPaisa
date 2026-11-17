import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards, Req, ParseIntPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ExpensesService } from './expenses.service';
import { CreateExpenseDto, UpdateExpenseDto, ExpenseResponseDto, ExpenseListResponseDto, ParseSmsDto, ParseSmsResponseDto, BatchCreateExpenseDto, BatchCreateResponseDto } from './dto/expense.dto';
import { DeleteResponseDto } from '../subscriptions/dto/subscription.dto';

@ApiTags('Expenses')
@UseGuards(JwtAuthGuard)
@Controller('api/expenses')
export class ExpensesController {
  constructor(private service: ExpensesService) {}

  @Get()
  async findAll(
    @Req() req: Request,
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
    @Query('month') month?: string,
    @Query('category') category?: string,
  ): Promise<ExpenseListResponseDto> {
    const user = req.user as { id: string };
    return this.service.findAll(user.id, page ?? 1, limit ?? 20, month, category);
  }

  @Get(':id')
  async findOne(@Req() req: Request, @Param('id') id: string): Promise<ExpenseResponseDto> {
    const user = req.user as { id: string };
    return this.service.findOne(user.id, id);
  }

  @Post('parse-sms')
  async parseSms(@Body() dto: ParseSmsDto): Promise<ParseSmsResponseDto> {
    return this.service.parseSmsMessages(dto.messages);
  }

  @Post('batch')
  async createBatch(@Req() req: Request, @Body() dto: BatchCreateExpenseDto): Promise<BatchCreateResponseDto> {
    const user = req.user as { id: string };
    return this.service.createBatch(user.id, dto.expenses);
  }

  @Post()
  async create(@Req() req: Request, @Body() dto: CreateExpenseDto): Promise<ExpenseResponseDto> {
    const user = req.user as { id: string };
    return this.service.create(user.id, dto);
  }

  @Patch(':id')
  async update(@Req() req: Request, @Param('id') id: string, @Body() dto: UpdateExpenseDto): Promise<ExpenseResponseDto> {
    const user = req.user as { id: string };
    return this.service.update(user.id, id, dto);
  }

  @Delete(':id')
  async remove(@Req() req: Request, @Param('id') id: string): Promise<DeleteResponseDto> {
    const user = req.user as { id: string };
    return this.service.remove(user.id, id);
  }
}
