export declare class ChatRequestDto {
    message: string;
    conversationId?: string;
}
export declare class ChatMessageDto {
    id: string;
    role: string;
    content: string;
    createdAt: string;
}
export declare class ChatResponseDto {
    conversationId: string;
    message: ChatMessageDto;
}
export declare class ConversationSummaryDto {
    id: string;
    lastMessage: string;
    updatedAt: string;
}
export declare class ConversationListResponseDto {
    items: ConversationSummaryDto[];
}
export declare class MessageListResponseDto {
    items: ChatMessageDto[];
    total: number;
    page: number;
    totalPages: number;
}
export declare class SuggestionItemDto {
    id: string;
    title: string;
    description: string;
    category: string;
    icon: string;
}
export declare class SuggestionsResponseDto {
    items: SuggestionItemDto[];
    generatedAt: string;
}
