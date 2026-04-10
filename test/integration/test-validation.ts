import { parseWorkflow } from '../../src/core/workflow/parser.js';
import 'dotenv/config';

async function testInvalidAI() {
  console.log('\n=== TEST: AI Node without prompt ===\n');
  
  const workflow = {
    name: 'invalid-ai-no-prompt',
    nodes: [
      { id: 'ai-node', type: 'ai', config: {} }
    ],
    edges: [
      { from: '__start__', to: 'ai-node' },
      { from: 'ai-node', to: '__end__' }
    ]
  };
  
  const result = await parseWorkflow(workflow, {
    apiKey: process.env.OPENROUTER_API_KEY,
  });
  
  if (result.errors) {
    console.log('✓ Expected validation errors:');
    result.errors.forEach(e => console.log(`  - ${e}`));
  } else {
    console.log('✗ Parser should have failed but did not!');
  }
}

async function testValidAI() {
  console.log('\n=== TEST: AI Node with prompt ===\n');
  
  const workflow = {
    name: 'valid-ai-with-prompt',
    nodes: [
      { id: 'ai-node', type: 'ai', config: { prompt: 'Say hi' } }
    ],
    edges: [
      { from: '__start__', to: 'ai-node' },
      { from: 'ai-node', to: '__end__' }
    ]
  };
  
  const result = await parseWorkflow(workflow, {
    apiKey: process.env.OPENROUTER_API_KEY,
  });
  
  if (result.errors) {
    console.log('✗ Unexpected errors:', result.errors);
  } else {
    console.log('✓ Parser OK, config validated correctly');
  }
}

async function main() {
  console.log('═══════════════════════════════════════════');
  console.log('   NODE CONFIG VALIDATION TESTS');
  console.log('═══════════════════════════════════════════');
  
  await testInvalidAI();
  await testValidAI();
  
  console.log('\n═══════════════════════════════════════════');
  console.log('   TESTS COMPLETED');
  console.log('═══════════════════════════════════════════\n');
}

main().catch(console.error);