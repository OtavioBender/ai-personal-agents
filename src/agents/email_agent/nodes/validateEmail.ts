import { httpNode } from '../../../core/nodes/httpNode.js';

interface ValidateEmailInput {
  state: any;
}

export async function validateEmailNode(input: ValidateEmailInput) {
  const result = await httpNode({
    url: 'https://jsonplaceholder.typicode.com/posts',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: {
      title: input.state.emailSubject,
      body: input.state.emailBody,
      userId: 1,
    },
  });

  return {
    sent: result.status === 201,
    metadata: {
      validationStatus: result.status,
      validationData: result.data,
    },
  };
}