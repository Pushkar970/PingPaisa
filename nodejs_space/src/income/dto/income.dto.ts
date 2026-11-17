import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsDateString, IsArray, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateIncomeDto {
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

export class UpdateIncomeDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsNumber()
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

export class ParseCreditSmsDto {
  @IsArray()
  @IsString({ each: true })
  messages: string[];
}

export class ParsedIncomeItemDto {
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

export class ParseCreditSmsResponseDto {
  @ApiProperty({ type: [ParsedIncomeItemDto] })
  parsed: ParsedIncomeItemDto[];

  @ApiProperty()
  total: number;

  @ApiProperty()
  failed: number;
}

export class BatchCreateIncomeDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateIncomeDto)
  incomes: CreateIncomeDto[];
}

export class IncomeResponseDto {
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

export class BatchCreateIncomeResponseDto {
  @ApiProperty({ type: [IncomeResponseDto] })
  items: IncomeResponseDto[];

  @ApiProperty()
  count: number;
}

export class IncomeListResponseDto {
  @ApiProperty({ type: [IncomeResponseDto] })
  items: IncomeResponseDto[];

  @ApiProperty()
  total: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  totalPages: number;
}
