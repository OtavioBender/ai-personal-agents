import { StateGraph } from '@langchain/langgraph';
import { EmailAgentStateSchema, type EmailAgentState } from './schema.js';
import { analyzeEmailNode } from './nodes/analyzeEmail.js';
import { validateEmailNode } from './nodes/validateEmail.js';

const workflow = new StateGraph(EmailAgentStateSchema)
  .addNode('analyze', async (state: EmailAgentState, config: any) => {
    const emailSubject = config?.configurable?.emailSubject as string || '';
    const emailBody = config?.configurable?.emailBody as string || '';
    return analyzeEmailNode({ state, emailSubject, emailBody, apiKey: config?.configurable?.apiKey as string || '' });
  })
  .addNode('validate', async (state: EmailAgentState) => {
    return validateEmailNode({ state });
  })
  .addEdge('__start__', 'analyze')
  .addEdge('analyze', 'validate')
  .addEdge('validate', '__end__');

export const emailAgentGraph: any = workflow.compile();