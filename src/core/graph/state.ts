import { z } from 'zod';

export const BaseStateSchema = z.object({
  messages: z.array(z.object({
    role: z.enum(['user', 'assistant', 'system', 'tool']),
    content: z.string(),
  })).default([]),
  metadata: z.record(z.any()).default({}),
});

export type BaseState = z.infer<typeof BaseStateSchema>;

export type Message = {
  role: 'user' | 'assistant' | 'system' | 'tool';
  content: string;
};