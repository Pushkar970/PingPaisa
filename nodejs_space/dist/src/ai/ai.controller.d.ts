import type { Request } from 'express';
import { AiService } from './ai.service';
import { ChatRequestDto, ChatResponseDto, ConversationListResponseDto, MessageListResponseDto, SuggestionsResponseDto } from './dto/ai.dto';
export declare class AiController {
    private service;
    constructor(service: AiService);
    chat(req: Request, dto: ChatRequestDto): Promise<ChatResponseDto>;
    getConversations(req: Request): Promise<ConversationListResponseDto>;
    getMessages(req: Request, id: string, page?: number, limit?: number): Promise<MessageListResponseDto>;
    getSuggestions(req: Request): Promise<SuggestionsResponseDto>;
}
