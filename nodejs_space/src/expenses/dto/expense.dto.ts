import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsDateString, IsArray, ArrayMaxSize, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateExpenseDto {
  @IsString()
  title: string;

  @IsNumber()
  @Min(0.01)
  amount: number;

  @IsString()
  category: string;

  @IsDateString()
  date: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsString()
  @IsOptional()
  source?: string;
}

export class UpdateExpenseDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsNumber()
  @Min(0.01)
  @IsOptional()
  amount?: number;

  @IsString()
  @IsOptional()
  category?: string;

  @IsDateString()
  @IsOptional()
  date?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}

export class ParseSmsDto {
  @IsArray()
  @ArrayMaxSize(50)
  @IsString({ each: true })
  messages: string[];
}

export class ParsedExpenseItemDto {
  @ApiProperty()
  title: string;

  @ApiProperty()
  amount: number;

  @ApiProperty()
  category: string;

  @ApiProperty()
  date: string;

  @ApiProperty({ nullable: true })
  notes: string | null;

  @ApiProperty()
  originalSms: string;
}

export class ParseSmsResponseDto {
  @ApiProperty({ type: [ParsedExpenseItemDto] })
  parsed: ParsedExpenseItemDto[];

  @ApiProperty()
  total: number;

  @ApiProperty()
  failed: number;
}

export class BatchCreateExpenseDto {
  @IsArray()
  @ArrayMaxSize(100)
  @ValidateNested({ each: true })
  @Type(() => CreateExpenseDto)
  expenses: CreateExpenseDto[];
}

export class ExpenseResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  amount: number;

  @ApiProperty()
  category: string;

  @ApiProperty()
  date: string;

  @ApiProperty({ nullable: true })
  notes: string | null;

  @ApiProperty()
  source: string;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  updatedAt: string;
}

export class BatchCreateResponseDto {
  @ApiProperty({ type: [ExpenseResponseDto] })
  items: ExpenseResponseDto[];

  @ApiProperty()
  count: number;
}

export class ExpenseListResponseDto {
  @ApiProperty({ type: [ExpenseResponseDto] })
  items: ExpenseResponseDto[];

  @ApiProperty()
  total: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  totalPages: number;
}
