// @ts-nocheck
import type { ChatMessageDto } from './chatMessageDto';

export interface ChatResponseDto {
  conversationId: string;
  message: ChatMessageDto;
}
