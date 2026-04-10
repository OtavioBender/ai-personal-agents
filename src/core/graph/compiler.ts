export interface GraphConfig {
  name: string;
  checkpointer?: any;
}

export function createGraphCompiler(config: GraphConfig) {
  return function compile(graph: any) {
    return graph.compile({
      checkpointer: config.checkpointer,
    });
  };
}