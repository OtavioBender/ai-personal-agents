import { z } from 'zod';

export const EmailAgentStateSchema = z.object({
  messages: z.array(z.object({
    role: z.enum(['user', 'assistant', 'system', 'tool']),
    content: z.string(),
  })).default([]),
  metadata: z.record(z.any()).default({}),
  emailSubject: z.string().optional(),
  emailBody: z.string().optional(),
  sent: z.boolean().optional(),
});

export type EmailAgentState = z.infer<typeof EmailAgentStateSchema>;

export const EmailAgentInputSchema = z.object({
  emailSubject: z.string(),
  emailBody: z.string(),
});

export type EmailAgentInput = z.infer<typeof EmailAgentInputSchema>;

export const EmailAgentOutputSchema = z.object({
  emailSubject: z.string(),
  emailBody: z.string(),
  sent: z.boolean(),
  messages: z.array(z.object({
    role: z.enum(['user', 'assistant', 'system', 'tool']),
    content: z.string(),
  })),
});

export type EmailAgentOutput = z.infer<typeof EmailAgentOutputSchema>;