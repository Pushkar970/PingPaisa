import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class ChatRequestDto {
  @IsString()
  message: string;

  @IsString()
  @IsOptional()
  conversationId?: string;
}

export class ChatMessageDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  role: string;

  @ApiProperty()
  content: string;

  @ApiProperty()
  createdAt: string;
}

export class ChatResponseDto {
  @ApiProperty()
  conversationId: string;

  @ApiProperty({ type: ChatMessageDto })
  message: ChatMessageDto;
}

export class ConversationSummaryDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  lastMessage: string;

  @ApiProperty()
  updatedAt: string;
}

export class ConversationListResponseDto {
  @ApiProperty({ type: [ConversationSummaryDto] })
  items: ConversationSummaryDto[];
}

export class MessageListResponseDto {
  @ApiProperty({ type: [ChatMessageDto] })
  items: ChatMessageDto[];

  @ApiProperty()
  total: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  totalPages: number;
}

export class SuggestionItemDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  category: string;

  @ApiProperty()
  icon: string;
}

export class SuggestionsResponseDto {
  @ApiProperty({ type: [SuggestionItemDto] })
  items: SuggestionItemDto[];

  @ApiProperty()
  generatedAt: string;
}
