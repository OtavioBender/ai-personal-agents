import { StateGraph, START, END } from '@langchain/langgraph';
import { z } from 'zod';
import { WorkflowJSONSchema, type WorkflowJSON } from './types.js';
import { validateWorkflow } from './validator.js';
import { getNodeFactory } from './registry.js';
import { BaseStateSchema, type BaseState } from '../graph/state.js';

export interface WorkflowParseOptions {
  apiKey?: string;
}

export interface WorkflowParseResult {
  graph: any;
  errors?: string[];
}

export async function parseWorkflow(workflowJson: any, options: WorkflowParseOptions = {}): Promise<WorkflowParseResult> {
  const parsed = WorkflowJSONSchema.safeParse(workflowJson);
  
  if (!parsed.success) {
    return {
      graph: null,
      errors: parsed.error.errors.map(e => `${e.path.join('.')}: ${e.message}`),
    };
  }

  const workflow: WorkflowJSON = parsed.data;

  const validationErrors = validateWorkflow(workflow);
  if (validationErrors.length > 0) {
    return {
      graph: null,
      errors: validationErrors.map(e => `[${e.code}] ${e.message}`),
    };
  }

  const nodeMap = new Map<string, any>();
  
  for (const node of workflow.nodes) {
    const factory = getNodeFactory(node.type);
    if (!factory) {
      return {
        graph: null,
        errors: [`Unknown node type: ${node.type}`],
      };
    }

    const config = { ...node.config, apiKey: options.apiKey };
    nodeMap.set(node.id, await factory(config));
  }

  const graphBuilder = new StateGraph(BaseStateSchema);

  for (const node of workflow.nodes) {
    const nodeFn = nodeMap.get(node.id);
    graphBuilder.addNode(node.id, async (state: BaseState) => {
      const result = await nodeFn(state);
      return {
        messages: [...state.messages, { role: 'assistant' as const, content: JSON.stringify(result) }],
      };
    });
  }

  const startEdges = workflow.edges.filter(e => e.from === '__start__');
  for (const edge of startEdges) {
    graphBuilder.addEdge(START, edge.to as any);
  }

  const normalEdges = workflow.edges.filter(e => e.from !== '__start__' && e.to !== '__end__');
  for (const edge of normalEdges) {
    graphBuilder.addEdge(edge.from as any, edge.to as any);
  }

  const endEdges = workflow.edges.filter(e => e.to === '__end__');
  for (const edge of endEdges) {
    graphBuilder.addEdge(edge.from as any, END);
  }

  const compiledGraph = graphBuilder.compile();

  return { graph: compiledGraph, errors: undefined };
}