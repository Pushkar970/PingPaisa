// @ts-nocheck
import type { ChatMessageDto } from './chatMessageDto';

export interface MessageListResponseDto {
  items: ChatMessageDto[];
  total: number;
  page: number;
  totalPages: number;
}
