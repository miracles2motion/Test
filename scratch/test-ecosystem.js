import { WaveComposer } from '../src/wave-composer.js';
import { EnemyRuntime } from '../src/enemy-runtime.js';
import { BIOME_ENEMY_ARCHETYPES } from '../src/biome-archetypes.js';

console.log("=== Testing Phase 6 Ecosystem Pipeline ===\n");

// 1. Compose Campaign
const biome = 'alien_jungle';
const archetypes = BIOME_ENEMY_ARCHETYPES[biome];
const composer = new WaveComposer(biome, 4);

console.log(`[GENERATING CAMPAIGN: 5 Waves]`);
const campaign = composer.composeFullCampaign(5, archetypes);

for (const wave of campaign) {
  console.log(`Wave ${wave.waveNumber}: Phase [${wave.pacingPhase}] | Intensity: ${wave.intensity.toFixed(1)} | Enemies: ${wave.enemies.length}`);
}

// 2. Runtime Execution
console.log(`\n[STARTING RUNTIME]`);
const dreamOutput = {
  waveCampaign: campaign,
  mutatedRoster: archetypes,
  bossProfile: null
};

const runtime = new EnemyRuntime(dreamOutput);
const player = { position: { x: 0, y: 0, z: 0 } };
const mapContext = {};

// Simulate Wave 1 (Intro)
runtime.onWaveStart(1, player, mapContext);

// Simulate Wave 4 (Surge - high chance of special event)
runtime.onWaveStart(4, player, mapContext);

console.log("\n=== Ecosystem Pipeline Test Complete ===");
