// @ts-nocheck
import type { SuggestionItemDto } from './suggestionItemDto';

export interface SuggestionsResponseDto {
  items: SuggestionItemDto[];
  generatedAt: string;
}
