import { parseWorkflow } from '../../src/core/workflow/parser.js';
import { WorkflowExecutor } from '../../src/core/graph/executor.js';
import { readFileSync } from 'fs';
import { join } from 'path';
import 'dotenv/config';

function loadWorkflow(filename: string) {
  const path = join(process.cwd(), 'test/fixtures/workflows', filename);
  return JSON.parse(readFileSync(path, 'utf-8'));
}

async function testHTTPWorkflow() {
  console.log('\n=== TEST 1: HTTP Only Workflow ===\n');
  
  const workflowJson = loadWorkflow('http-only.json');
  console.log('Workflow:', workflowJson.name);
  
  const result = await parseWorkflow(workflowJson, {
    apiKey: process.env.OPENROUTER_API_KEY,
  });
  
  if (result.errors) {
    console.log('Parser Errors:', result.errors);
    return;
  }
  
  console.log('✓ Parser OK, graph compiled');
  
  const executor = new WorkflowExecutor(result.graph);
  
  try {
    const executionResult = await executor.execute({
      input: { messages: [], metadata: {} },
    });
    console.log('✓ Execution OK');
    console.log('Result:', JSON.stringify(executionResult, null, 2));
  } catch (error) {
    console.log('✗ Execution Failed:', error.message);
  }
}

async function testAISimpleWorkflow() {
  console.log('\n=== TEST 2: AI Simple Workflow ===\n');
  
  const workflowJson = loadWorkflow('ai-simple.json');
  console.log('Workflow:', workflowJson.name);
  
  const result = await parseWorkflow(workflowJson, {
    apiKey: process.env.OPENROUTER_API_KEY,
  });
  
  if (result.errors) {
    console.log('Parser Errors:', result.errors);
    return;
  }
  
  console.log('✓ Parser OK, graph compiled');
  
  const executor = new WorkflowExecutor(result.graph);
  
  try {
    const executionResult = await executor.execute({
      input: { messages: [], metadata: {} },
    });
    console.log('✓ Execution OK');
    console.log('Result:', JSON.stringify(executionResult, null, 2));
  } catch (error) {
    console.log('✗ Execution Failed:', error.message);
  }
}

async function testInvalidWorkflow() {
  console.log('\n=== TEST 3: Invalid Workflow (cycle) ===\n');
  
  const workflowJson = loadWorkflow('invalid-cycle.json');
  console.log('Workflow:', workflowJson.name);
  
  const result = await parseWorkflow(workflowJson, {
    apiKey: process.env.OPENROUTER_API_KEY,
  });
  
  if (result.errors) {
    console.log('✓ Expected validation errors:', result.errors);
  } else {
    console.log('✗ Parser should have failed but did not!');
  }
}

async function main() {
  console.log('═══════════════════════════════════════════');
  console.log('   WORKFLOW INTEGRATION TESTS');
  console.log('═══════════════════════════════════════════');
  
  await testHTTPWorkflow();
  await testAISimpleWorkflow();
  await testInvalidWorkflow();
  
  console.log('\n═══════════════════════════════════════════');
  console.log('   TESTS COMPLETED');
  console.log('═══════════════════════════════════════════\n');
}

main().catch(console.error);