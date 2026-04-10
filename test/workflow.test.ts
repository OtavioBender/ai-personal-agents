import { describe, it, expect } from 'vitest';
import { validateWorkflow } from '../src/core/workflow/validator.js';
import { parseWorkflow } from '../src/core/workflow/parser.js';

describe('Workflow Validator', () => {
  it('should validate a valid workflow', () => {
    const workflow = {
      name: 'test-workflow',
      nodes: [
        { id: 'node1', type: 'ai', config: { prompt: 'test' } },
        { id: 'node2', type: 'http', config: { url: 'https://example.com', method: 'GET' } },
      ],
      edges: [
        { from: '__start__', to: 'node1' },
        { from: 'node1', to: 'node2' },
        { from: 'node2', to: '__end__' },
      ],
    };

    const errors = validateWorkflow(workflow as any);
    expect(errors).toHaveLength(0);
  });

  it('should reject workflow with missing start connection', () => {
    const workflow = {
      name: 'test-workflow',
      nodes: [
        { id: 'node1', type: 'ai', config: { prompt: 'test' } },
      ],
      edges: [
        { from: 'node1', to: '__end__' },
      ],
    };

    const errors = validateWorkflow(workflow as any);
    expect(errors.some(e => e.code === 'NO_START_CONNECTION')).toBe(true);
  });

  it('should reject workflow with missing end connection', () => {
    const workflow = {
      name: 'test-workflow',
      nodes: [
        { id: 'node1', type: 'ai', config: { prompt: 'test' } },
      ],
      edges: [
        { from: '__start__', to: 'node1' },
      ],
    };

    const errors = validateWorkflow(workflow as any);
    expect(errors.some(e => e.code === 'NO_END_CONNECTION')).toBe(true);
  });

  it('should reject workflow with orphan node', () => {
    const workflow = {
      name: 'test-workflow',
      nodes: [
        { id: 'node1', type: 'ai', config: { prompt: 'test' } },
        { id: 'node2', type: 'ai', config: { prompt: 'test' } },
      ],
      edges: [
        { from: '__start__', to: 'node1' },
        { from: 'node1', to: '__end__' },
      ],
    };

    const errors = validateWorkflow(workflow as any);
    expect(errors.some(e => e.code === 'ORPHAN_NODE')).toBe(true);
  });

  it('should reject workflow with self-referencing edge', () => {
    const workflow = {
      name: 'test-workflow',
      nodes: [
        { id: 'node1', type: 'ai', config: { prompt: 'test' } },
      ],
      edges: [
        { from: '__start__', to: 'node1' },
        { from: 'node1', to: 'node1' },
        { from: 'node1', to: '__end__' },
      ],
    };

    const errors = validateWorkflow(workflow as any);
    expect(errors.some(e => e.code === 'SELF_REFERENCE')).toBe(true);
  });

  it('should reject workflow with simple cycle', () => {
    const workflow = {
      name: 'test-workflow',
      nodes: [
        { id: 'node1', type: 'ai', config: { prompt: 'test' } },
        { id: 'node2', type: 'ai', config: { prompt: 'test' } },
      ],
      edges: [
        { from: '__start__', to: 'node1' },
        { from: 'node1', to: 'node2' },
        { from: 'node2', to: 'node1' },
        { from: 'node1', to: '__end__' },
      ],
    };

    const errors = validateWorkflow(workflow as any);
    expect(errors.some(e => e.code === 'SIMPLE_CYCLE')).toBe(true);
  });

  it('should reject workflow with unknown node in edge', () => {
    const workflow = {
      name: 'test-workflow',
      nodes: [
        { id: 'node1', type: 'ai', config: { prompt: 'test' } },
      ],
      edges: [
        { from: '__start__', to: 'node1' },
        { from: 'node1', to: 'unknown' },
        { from: 'unknown', to: '__end__' },
      ],
    };

    const errors = validateWorkflow(workflow as any);
    expect(errors.some(e => e.code === 'UNKNOWN_TO_NODE')).toBe(true);
  });
});

describe('Workflow Parser', () => {
  it('should parse valid workflow and return compiled graph', async () => {
    const workflow = {
      name: 'test-workflow',
      nodes: [
        { id: 'node1', type: 'ai', config: { prompt: 'Hello' } },
      ],
      edges: [
        { from: '__start__', to: 'node1' },
        { from: 'node1', to: '__end__' },
      ],
    };

    const result = await parseWorkflow(workflow, { apiKey: 'test-key' });
    expect(result.errors).toBeUndefined();
    expect(result.graph).toBeDefined();
  });

  it('should return errors for invalid workflow JSON', async () => {
    const workflow = {
      name: 'test',
      nodes: [],
      edges: [],
    };

    const result = await parseWorkflow(workflow);
    expect(result.errors).toBeDefined();
    expect(result.graph).toBeNull();
  });
});