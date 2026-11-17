import { Controller, Post, Get, Body, Param, Query, UseGuards, Req, ParseIntPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AiService } from './ai.service';
import { ChatRequestDto, ChatResponseDto, ConversationListResponseDto, MessageListResponseDto, SuggestionsResponseDto } from './dto/ai.dto';

@ApiTags('AI')
@UseGuards(JwtAuthGuard)
@Controller('api/ai')
export class AiController {
  constructor(private service: AiService) {}

  @Post('chat')
  async chat(@Req() req: Request, @Body() dto: ChatRequestDto): Promise<ChatResponseDto> {
    const user = req.user as { id: string };
    return this.service.chat(user.id, dto.message, dto.conversationId);
  }

  @Get('conversations')
  async getConversations(@Req() req: Request): Promise<ConversationListResponseDto> {
    const user = req.user as { id: string };
    return this.service.getConversations(user.id);
  }

  @Get('conversations/:id/messages')
  async getMessages(
    @Req() req: Request,
    @Param('id') id: string,
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ): Promise<MessageListResponseDto> {
    const user = req.user as { id: string };
    return this.service.getMessages(user.id, id, page ?? 1, limit ?? 50);
  }

  @Get('suggestions')
  async getSuggestions(@Req() req: Request): Promise<SuggestionsResponseDto> {
    const user = req.user as { id: string };
    return this.service.getSuggestions(user.id);
  }
}
