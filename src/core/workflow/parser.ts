import { StateGraph, START, END } from '@langchain/langgraph';
import { z } from 'zod';
import { WorkflowJSONSchema, type WorkflowJSON } from './types.js';
import { validateWorkflow } from './validator.js';
import { getNodeFactory } from './registry.js';
import { BaseStateSchema, type BaseState } from '../graph/state.js';

const LOG_PREFIX = '[WorkflowParser]';

export interface WorkflowParseOptions {
  apiKey?: string;
}

export interface WorkflowParseResult {
  graph: any;
  errors?: string[];
}

export async function parseWorkflow(workflowJson: any, options: WorkflowParseOptions = {}): Promise<WorkflowParseResult> {
  console.log(`${LOG_PREFIX} Parsing workflow: ${workflowJson.name || 'unnamed'}`);
  
  const parsed = WorkflowJSONSchema.safeParse(workflowJson);
  
  if (!parsed.success) {
    console.log(`${LOG_PREFIX} Schema validation failed`);
    return {
      graph: null,
      errors: parsed.error.errors.map(e => `${e.path.join('.')}: ${e.message}`),
    };
  }

  const workflow: WorkflowJSON = parsed.data;
  console.log(`${LOG_PREFIX} Validated ${workflow.nodes.length} nodes, ${workflow.edges.length} edges`);

  const validationErrors = validateWorkflow(workflow);
  if (validationErrors.length > 0) {
    console.log(`${LOG_PREFIX} Workflow validation failed with ${validationErrors.length} errors`);
    return {
      graph: null,
      errors: validationErrors.map(e => `[${e.code}] ${e.message}`),
    };
  }

  const nodeMap = new Map<string, any>();
  
  for (const node of workflow.nodes) {
    const factory = getNodeFactory(node.type);
    if (!factory) {
      console.log(`${LOG_PREFIX} Unknown node type: ${node.type}`);
      return {
        graph: null,
        errors: [`Unknown node type: ${node.type}`],
      };
    }

    console.log(`  → Creating node: ${node.id} (${node.type})`);
    const nodeConfig = { ...node.config, apiKey: options.apiKey };
    
    if (node.type === 'ai') {
      nodeMap.set(node.id, {
        factory: await factory({ apiKey: options.apiKey || '' }),
        nodeConfig: node.config,
      });
    } else {
      nodeMap.set(node.id, {
        factory: await factory(nodeConfig),
        nodeConfig: node.config,
      });
    }
  }

  const graphBuilder = new StateGraph(BaseStateSchema);

  for (const node of workflow.nodes) {
    const nodeData = nodeMap.get(node.id);
    const { factory, nodeConfig } = nodeData;
    const nodeId = node.id;
    
    graphBuilder.addNode(nodeId, async (state: BaseState) => {
      console.log(`  [Node:${nodeId}] Starting...`);
      const startTime = Date.now();
      
      try {
        let result;
        
        if (node.type === 'ai') {
          const aiInput = {
            prompt: typeof nodeConfig.prompt === 'string' ? nodeConfig.prompt : JSON.stringify(nodeConfig),
          };
          result = await factory(aiInput);
        } else {
          const httpInput = {
            ...nodeConfig,
            state,
          };
          result = await factory(httpInput);
        }
        
        const elapsed = Date.now() - startTime;
        console.log(`  [Node:${nodeId}] Completed in ${elapsed}ms`);
        
        return {
          messages: [...state.messages, { role: 'assistant' as const, content: JSON.stringify(result) }],
        };
      } catch (error) {
        const elapsed = Date.now() - startTime;
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error(`  [Node:${nodeId}] Failed after ${elapsed}ms: ${errorMessage}`);
        throw error;
      }
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
  console.log(`${LOG_PREFIX} Workflow compiled successfully`);

  return { graph: compiledGraph, errors: undefined };
}