import { createAINode } from '../../../core/nodes/aiNode.js';

interface AnalyzeEmailInput {
  state: any;
  emailSubject: string;
  emailBody: string;
  apiKey: string;
}

export async function analyzeEmailNode(input: AnalyzeEmailInput) {
  const aiNode = await createAINode({ apiKey: input.apiKey });

  const result = await aiNode({
    prompt: `
Assunto: ${input.emailSubject}
Corpo: ${input.emailBody}

Analise este email e determine se está pronto para envio.
`,
    temperature: 0.7,
  });

  return {
    messages: [
      ...input.state.messages,
      { role: 'assistant' as const, content: result.response },
    ],
  };
}