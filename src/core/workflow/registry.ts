import { createAINode, type AINodeConfig } from '../nodes/aiNode.js';
import { httpNode } from '../nodes/httpNode.js';
import type { NodeRegistry, NodeFactory } from './types.js';

const createAIFactory: NodeFactory = async (config: Record<string, any>) => {
  const aiConfig: AINodeConfig = {
    apiKey: config.apiKey || '',
  };
  return createAINode(aiConfig);
};

const createHTTPFactory: NodeFactory = async (config: Record<string, any>) => {
  return async (input: any) => httpNode({ ...config, ...input });
};

export const NODE_REGISTRY: NodeRegistry = {
  ai: createAIFactory,
  http: createHTTPFactory,
};

export function getNodeFactory(type: string): NodeFactory | undefined {
  return NODE_REGISTRY[type];
}