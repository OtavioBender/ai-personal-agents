import { z } from 'zod';

export const WorkflowNodeSchema = z.object({
  id: z.string().min(1),
  type: z.enum(['ai', 'http']),
  config: z.record(z.any()),
});

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