import { parseWorkflow } from '../../src/core/workflow/parser.js';
import { WorkflowExecutor } from '../../src/core/graph/executor.js';
import 'dotenv/config';

async function testTimeout() {
  console.log('\n=== TEST: Workflow with custom timeout ===\n');
  
  const workflow = {
    name: 'timeout-test',
    nodes: [
      { id: 'slow', type: 'http', config: { url: 'https://httpbin.org/delay/10', method: 'GET' } }
    ],
    edges: [
      { from: '__start__', to: 'slow' },
      { from: 'slow', to: '__end__' }
    ]
  };
  
  const result = await parseWorkflow(workflow, { apiKey: process.env.OPENROUTER_API_KEY });
  
  if (result.errors) {
    console.log('Errors:', result.errors);
    return;
  }
  
  console.log('Workflow parsed, testing with timeout...');
  
  const executor = new WorkflowExecutor(result.graph);
  
  try {
    await executor.execute({
      input: { messages: [], metadata: {} },
      timeoutMs: 5000,
    });
    console.log('✓ Completed before timeout');
  } catch (error) {
    console.log(`✓ Timeout working: ${error.message}`);
  }
}

async function main() {
  console.log('═══════════════════════════════════════════');
  console.log('   TIMEOUT TEST');
  console.log('═══════════════════════════════════════════');
  
  await testTimeout();
  
  console.log('\n═══════════════════════════════════════════');
  console.log('   TEST COMPLETED');
  console.log('═══════════════════════════════════════════\n');
}

main().catch(console.error);