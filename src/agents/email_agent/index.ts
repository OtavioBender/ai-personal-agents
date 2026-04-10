import { WorkflowExecutor } from '../../core/graph/executor.js';
import { emailAgentGraph } from './graph.js';
import { EmailAgentInputSchema, type EmailAgentState } from './schema.js';

const executor = new WorkflowExecutor(emailAgentGraph);

interface ExecuteEmailAgentInput {
  emailSubject: string;
  emailBody: string;
}

export async function executeEmailAgent(
  input: ExecuteEmailAgentInput,
  apiKey: string
): Promise<EmailAgentState> {
  const validatedInput = EmailAgentInputSchema.parse(input);

  const state = {
    messages: [
      { role: 'user' as const, content: `Subject: ${validatedInput.emailSubject}\nBody: ${validatedInput.emailBody}` },
    ],
    metadata: {} as Record<string, any>,
    emailSubject: validatedInput.emailSubject,
    emailBody: validatedInput.emailBody,
  };

  return executor.execute({
    input: state,
    config: {
      configurable: { apiKey },
    },
  });
}

export { emailAgentGraph } from './graph.js';
export type { EmailAgentState } from './schema.js';
export { EmailAgentInputSchema } from './schema.js';