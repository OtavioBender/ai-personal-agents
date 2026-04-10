import { z } from 'zod';

export const AINodeConfigSchema = z.object({
  prompt: z.string().min(1, 'AI node requires a prompt'),
});

export const HTTPNodeConfigSchema = z.object({
  url: z.string().url(),
  method: z.enum(['GET', 'POST', 'PUT', 'DELETE']).default('GET'),
  headers: z.record(z.string()).optional(),
  body: z.any().optional(),
});

export const WorkflowNodeConfigSchema = z.union([
  AINodeConfigSchema,
  HTTPNodeConfigSchema,
]);

export const WorkflowNodeSchema = z.object({
  id: z.string().min(1),
  type: z.enum(['ai', 'http']),
  config: z.record(z.any()),
}).refine(
  (data) => {
    if (data.type === 'ai') return AINodeConfigSchema.safeParse(data.config).success;
    if (data.type === 'http') return HTTPNodeConfigSchema.safeParse(data.config).success;
    return false;
  },
  {
    message: 'Invalid config for node type',
  }
);

export const WorkflowEdgeSchema = z.object({
  from: z.string().min(1),
  to: z.string().min(1),
});

export const WorkflowJSONSchema = z.object({
  name: z.string().min(1),
  nodes: z.array(WorkflowNodeSchema).min(1),
  edges: z.array(WorkflowEdgeSchema).min(1),
});

export type WorkflowJSON = z.infer<typeof WorkflowJSONSchema>;
export type WorkflowNode = z.infer<typeof WorkflowNodeSchema>;
export type WorkflowEdge = z.infer<typeof WorkflowEdgeSchema>;

export type NodeType = 'ai' | 'http';

export type NodeFactory = (config: Record<string, any>) => Promise<(input: any) => Promise<any>>;

export interface NodeRegistry {
  [key: string]: NodeFactory;
}