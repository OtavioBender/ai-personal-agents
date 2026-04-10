import { z } from 'zod';
import { ChatOpenRouter } from '@langchain/openrouter';

const DEFAULT_MODEL = process.env.DEFAULT_MODEL || 'minimax/minimax-m2.5:free';
const FALLBACK_MODEL = 'openrouter/free';

export const AINodeInputSchema = z.object({
  prompt: z.string(),
  model: z.string().optional(),
  temperature: z.number().default(0.7),
});

export type AINodeInput = z.infer<typeof AINodeInputSchema>;

export interface AINodeOutput {
  response: string;
  messages: Array<{ role: 'assistant'; content: string }>;
  modelUsed: string;
}

export interface AINodeConfig {
  apiKey: string;
}

function createModel(apiKey: string, model: string) {
  return new ChatOpenRouter({
    model,
    temperature: 0.7,
    apiKey,
  });
}

function isRetryableError(error: unknown): boolean {
  if (error instanceof Error) {
    const msg = error.message.toLowerCase();
    if (msg.includes('429') || 
        msg.includes('rate_limit') || 
        msg.includes('rate-limited') ||
        msg.includes('limit exceeded') || 
        msg.includes('quota') ||
        msg.includes('503') ||
        msg.includes('timeout')) {
      return true;
    }
  }
  if (error && typeof error === 'object' && 'code' in error) {
    const code = (error as any).code;
    if (code === 429 || code === 503) {
      return true;
    }
  }
  return false;
}

export async function createAINode(config: AINodeConfig) {
  return async (input: AINodeInput): Promise<AINodeOutput> => {
    const primaryModel = input.model || DEFAULT_MODEL;
    let model = createModel(config.apiKey, primaryModel);

    try {
      const response = await model.invoke(input.prompt);

      return {
        response: response.content as string,
        messages: [{ role: 'assistant', content: response.content as string }],
        modelUsed: primaryModel,
      };
    } catch (error) {
      if (isRetryableError(error)) {
        console.warn(`Retryable error hit for model ${primaryModel}, falling back to ${FALLBACK_MODEL}`);

        model = createModel(config.apiKey, FALLBACK_MODEL);
        const response = await model.invoke(input.prompt);

        return {
          response: response.content as string,
          messages: [{ role: 'assistant', content: response.content as string }],
          modelUsed: FALLBACK_MODEL,
        };
      }

      throw error;
    }
  };
}