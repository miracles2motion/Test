import { AnatomyGrammar } from '../src/anatomy-grammar.js';
import { EnemyPenStylizer } from '../src/enemy-pen-style.js';

console.log("=== Testing Anatomy Grammar & Pen Stylizer ===\n");

const grammar = new AnatomyGrammar();
const stylizer = new EnemyPenStylizer();

// 1. Synthesize a Boss in an Alien Jungle
console.log("[Synthesizing BOSS for ALIEN JUNGLE]");
const jungleBossAnatomy = grammar.synthesizeAnatomy('alien_jungle', 'boss', 1.0);
const jungleBossProportions = grammar.generateBuildProportions(jungleBossAnatomy, 'boss');
const jungleBossStyle = stylizer.stylizeEnemy(jungleBossAnatomy, 'alien_jungle');

console.log("Anatomy Sockets:");
console.log(jungleBossAnatomy);
console.log("Build Proportions:");
console.log(jungleBossProportions);
console.log("Pen Renderer Style:");
console.log(jungleBossStyle);
console.log("\n");

// 2. Synthesize an Aerial enemy in a Crashed Spacecraft
console.log("[Synthesizing AERIAL for CRASHED SPACECRAFT]");
const spaceAerialAnatomy = grammar.synthesizeAnatomy('crashed_spacecraft', 'aerial', 1.0);
const spaceAerialProportions = grammar.generateBuildProportions(spaceAerialAnatomy, 'aerial');
const spaceAerialStyle = stylizer.stylizeEnemy(spaceAerialAnatomy, 'crashed_spacecraft');

console.log("Anatomy Sockets:");
console.log(spaceAerialAnatomy);
console.log("Build Proportions:");
console.log(spaceAerialProportions);
console.log("Pen Renderer Style:");
console.log(spaceAerialStyle);

console.log("\n=== Anatomy Test Complete ===");
