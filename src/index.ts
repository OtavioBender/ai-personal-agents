import 'dotenv/config';
import { executeEmailAgent } from './agents/email_agent/index.js';

const run = async () => {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    console.error('Please set OPENROUTER_API_KEY environment variable');
    process.exit(1);
  }

  console.log('Executing email agent...\n');

  const result = await executeEmailAgent(
    {
      emailSubject: 'Meeting Tomorrow',
      emailBody: 'Hi, let\'s meet tomorrow at 2pm to discuss the project.',
    },
    apiKey
  );

  console.log('Result:', JSON.stringify(result, null, 2));
};

run().catch(console.error);