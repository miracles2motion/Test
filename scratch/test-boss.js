import { BossSynthesizer } from '../src/boss-synthesizer.js';
import { BossRuntime } from '../src/boss-runtime.js';
import { AnatomyGrammar } from '../src/anatomy-grammar.js';

console.log("=== Testing Boss Synthesizer & Runtime ===\n");

async function runTest() {
  const mapContext = {};
  const biomeRegistry = {}; // Mock
  const anatomy = new AnatomyGrammar();
  
  const synthesizer = new BossSynthesizer(mapContext, biomeRegistry, anatomy);
  
  // 1. Synthesize the Encounter
  const request = { theme: 'gothic_cathedral', difficulty: 4 };
  const encounter = await synthesizer.synthesizeBossAndArena(request, { dominantBiome: 'gothic_cathedral' });
  
  console.log(`[SYNTHESIS COMPLETE]`);
  console.log(`Arena Features: ${encounter.arena.features.map(f => f.type).join(', ')}`);
  console.log(`Boss Mechanics: ${encounter.boss.mechanics.map(m => m.name).join(', ')}`);
  console.log(`Validation: ${encounter.validation.valid ? 'PASSED' : 'FAILED'}\n`);

  // 2. Runtime Simulation
  console.log(`[RUNTIME SIMULATION]`);
  const runtime = new BossRuntime(encounter.boss, encounter.arena, mapContext);
  
  const bossEntity = { position: { x: 0, y: 0, z: 0 }, speed: 1.0, actionLog: [] };
  const playerEntity = { position: { x: 10, y: 0, z: 0 } }; // 10m away
  
  runtime.spawn(bossEntity, playerEntity);
  
  console.log("Health 100% (Phase 1)");
  bossEntity.think(0.1);
  
  console.log("Health drops to 60% (Triggers Phase 2)");
  bossEntity.onDamage(0.60);
  
  // Wait for transition invulnerability to clear
  setTimeout(() => {
    bossEntity.think(0.1);
    
    console.log("Health drops to 30% (Triggers Phase 3)");
    bossEntity.onDamage(0.30);
    
    setTimeout(() => {
      bossEntity.think(0.1);
      
      console.log("\nAction Log:");
      console.log(bossEntity.actionLog.join('\n'));
      console.log("\n=== Boss Test Complete ===");
    }, 2100);
  }, 2100);
}

runTest();
