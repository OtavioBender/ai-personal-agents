import { BaseState } from './state.js';

export interface ExecuteOptions {
  input: BaseState;
  config?: { configurable?: Record<string, any> };
}

export class WorkflowExecutor {
  constructor(private graph: any) {}

  async execute(options: ExecuteOptions) {
    const result = await this.graph.invoke(options.input, options.config);
    return result;
  }

  async *stream(options: ExecuteOptions) {
    for await (const chunk of this.graph.stream(options.input, options.config)) {
      yield chunk;
    }
  }
}