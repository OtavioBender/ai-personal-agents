import { z } from 'zod';

export const HTTPNodeInputSchema = z.object({
  url: z.string().url(),
  method: z.enum(['GET', 'POST', 'PUT', 'DELETE']).default('GET'),
  headers: z.record(z.string()).optional().default({}),
  body: z.any().optional(),
});

export type HTTPNodeInput = z.infer<typeof HTTPNodeInputSchema>;

export interface HTTPNodeOutput {
  status: number;
  data: any;
  error?: string;
}

export const httpNode = async (input: HTTPNodeInput): Promise<HTTPNodeOutput> => {
  try {
    const response = await fetch(input.url, {
      method: input.method,
      headers: input.headers,
      body: input.body ? JSON.stringify(input.body) : undefined,
    });

    const data = await response.json().catch(() => null);

    return {
      status: response.status,
      data,
    };
  } catch (error) {
    return {
      status: 0,
      data: null,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};