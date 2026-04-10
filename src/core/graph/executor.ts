import { BaseState } from './state.js';

export interface ExecuteOptions {
  input: BaseState;
  config?: { configurable?: Record<string, any> };
  timeoutMs?: number;
}

export class WorkflowExecutor {
  constructor(private graph: any) {}

  async execute(options: ExecuteOptions) {
    const { timeoutMs = 60000, ...executeOptions } = options;
    
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error(`Workflow execution timeout after ${timeoutMs}ms`)), timeoutMs)
    );
    
    const executionPromise = this.graph.invoke(executeOptions.input, executeOptions.config);
    
    const result = await Promise.race([executionPromise, timeoutPromise]);
    return result;
  }

  async *stream(options: ExecuteOptions) {
    for await (const chunk of this.graph.stream(options.input, options.config)) {
      yield chunk;
    }
  }
}