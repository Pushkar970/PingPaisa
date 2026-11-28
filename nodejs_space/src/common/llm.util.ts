import { ConfigService } from '@nestjs/config';

export interface LlmCallOptions {
  messages: { role: string; content: string }[];
  jsonMode?: boolean;
}

/**
 * Calls any OpenAI-compatible chat completions endpoint (Abacus.AI, Google Gemini, Groq, OpenAI).
 * Reads LLM_API_URL, LLM_API_KEY (fallback: ABACUSAI_API_KEY), and optional LLM_MODEL.
 */
export async function callLlmCompletion(
  configService: ConfigService,
  options: LlmCallOptions,
): Promise<string | null> {
  const apiKey =
    configService.get<string>('LLM_API_KEY') ||
    configService.get<string>('ABACUSAI_API_KEY');
  if (!apiKey) return null;

  const apiUrl =
    configService.get<string>('LLM_API_URL') ||
    'https://apps.abacus.ai/v1/chat/completions';
  const model = configService.get<string>('LLM_MODEL');

  const body: Record<string, unknown> = {
    messages: options.messages,
    stream: false,
  };
  if (model) body.model = model;
  if (options.jsonMode) body.response_format = { type: 'json_object' };

  const res = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(25000),
  });

  if (!res.ok) {
    throw new Error(`LLM API HTTP ${res.status}`);
  }

  const data = await res.json();
  return data?.choices?.[0]?.message?.content ?? null;
}
