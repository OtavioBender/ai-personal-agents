import type { WorkflowJSON, WorkflowEdge, WorkflowNode } from './types.js';

export interface ValidationError {
  code: string;
  message: string;
  path?: string;
}

export function validateWorkflow(workflow: WorkflowJSON): ValidationError[] {
  const errors: ValidationError[] = [];
  const nodeIds = new Set(workflow.nodes.map(n => n.id));

  const fromNodes = new Set(workflow.edges.map(e => e.from));
  const toNodes = new Set(workflow.edges.map(e => e.to));

  errors.push(...validateEdgesReferenceNodes(workflow.edges, nodeIds));
  errors.push(...validateNoSelfReferencing(workflow.edges));
  errors.push(...validateStartConnection(workflow.edges, nodeIds));
  errors.push(...validateEndConnection(workflow.edges, nodeIds));
  errors.push(...validateOrphanNodes(workflow.edges, nodeIds));
  errors.push(...validateNoSimpleCycles(workflow.edges, nodeIds));

  return errors;
}

function validateEdgesReferenceNodes(edges: WorkflowEdge[], nodeIds: Set<string>): ValidationError[] {
  const errors: ValidationError[] = [];
  for (const edge of edges) {
    if (edge.from !== '__start__' && edge.from !== '__end__' && !nodeIds.has(edge.from)) {
      errors.push({ code: 'UNKNOWN_FROM_NODE', message: `Edge references unknown node: ${edge.from}`, path: edge.from });
    }
    if (edge.to !== '__start__' && edge.to !== '__end__' && !nodeIds.has(edge.to)) {
      errors.push({ code: 'UNKNOWN_TO_NODE', message: `Edge references unknown node: ${edge.to}`, path: edge.to });
    }
  }
  return errors;
}

function validateNoSelfReferencing(edges: WorkflowEdge[]): ValidationError[] {
  const errors: ValidationError[] = [];
  for (const edge of edges) {
    if (edge.from === edge.to && edge.from !== '__start__' && edge.from !== '__end__') {
      errors.push({ code: 'SELF_REFERENCE', message: `Self-referencing edge: ${edge.from} → ${edge.from}` });
    }
  }
  return errors;
}

function validateStartConnection(edges: WorkflowEdge[], nodeIds: Set<string>): ValidationError[] {
  const errors: ValidationError[] = [];
  const startEdges = edges.filter(e => e.from === '__start__');
  if (startEdges.length === 0) {
    errors.push({ code: 'NO_START_CONNECTION', message: '__start__ must connect to at least one node' });
  }
  return errors;
}

function validateEndConnection(edges: WorkflowEdge[], nodeIds: Set<string>): ValidationError[] {
  const errors: ValidationError[] = [];
  const endEdges = edges.filter(e => e.to === '__end__');
  if (endEdges.length === 0) {
    errors.push({ code: 'NO_END_CONNECTION', message: 'At least one node must connect to __end__' });
  }
  return errors;
}

function validateOrphanNodes(edges: WorkflowEdge[], nodeIds: Set<string>): ValidationError[] {
  const errors: ValidationError[] = [];
  
  const reachable = new Set<string>();
  const startTargets = edges.filter(e => e.from === '__start__').map(e => e.to);
  const queue = [...startTargets];
  
  while (queue.length > 0) {
    const current = queue.shift()!;
    if (reachable.has(current)) continue;
    reachable.add(current);
    
    const outgoing = edges.filter(e => e.from === current).map(e => e.to);
    queue.push(...outgoing);
  }
  
  for (const nodeId of nodeIds) {
    if (!reachable.has(nodeId)) {
      errors.push({ code: 'ORPHAN_NODE', message: `Node not reachable from __start__: ${nodeId}`, path: nodeId });
    }
  }
  
  return errors;
}

function validateNoSimpleCycles(edges: WorkflowEdge[], nodeIds: Set<string>): ValidationError[] {
  const errors: ValidationError[] = [];
  
  const adjacency = new Map<string, string[]>();
  for (const nodeId of nodeIds) {
    adjacency.set(nodeId, []);
  }
  
  for (const edge of edges) {
    if (nodeIds.has(edge.from) && nodeIds.has(edge.to)) {
      adjacency.get(edge.from)!.push(edge.to);
    }
  }
  
  const visited = new Set<string>();
  const recursionStack = new Set<string>();
  
  function hasCycle(node: string, path: string[] = []): boolean {
    visited.add(node);
    recursionStack.add(node);
    
    const neighbors = adjacency.get(node) || [];
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        if (hasCycle(neighbor, [...path, neighbor])) return true;
      } else if (recursionStack.has(neighbor)) {
        const cycle = [...path.slice(path.indexOf(neighbor)), neighbor].join(' → ');
        errors.push({ code: 'SIMPLE_CYCLE', message: `Cycle detected: ${cycle}` });
        return true;
      }
    }
    
    recursionStack.delete(node);
    return false;
  }
  
  for (const nodeId of nodeIds) {
    if (!visited.has(nodeId)) {
      hasCycle(nodeId);
    }
  }
  
  return errors;
}