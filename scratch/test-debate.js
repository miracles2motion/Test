import { CreativeDebateEngine } from '../src/creative-debate.js';

async function runDebate() {
  const engine = new CreativeDebateEngine(null);
  
  const result = await engine.generateMap("Build a Gothic Cathedral built out of crystal", {});
  
  console.log("\n=== Final Blueprint Export ===");
  console.log(JSON.stringify(result.blueprint, null, 2));
}

runDebate();
