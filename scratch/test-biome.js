import { BIOME_REGISTRY } from '../src/biome-system.js';
import { BiomeMixer } from '../src/biome-mixer.js';

console.log("=== Testing Biome Mixer ===\n");

const mixer = new BiomeMixer(BIOME_REGISTRY);

// Define placements
// E.g., The map has a jungle in the center, and a crashed spacecraft slightly offset
const placements = [
  { biome: 'alien_jungle', center: [0, 0, 0], radius: 50, weight: 1.0 },
  { biome: 'crashed_spacecraft', center: [20, 0, 0], radius: 40, weight: 1.0 }
];

// Point 1: Deep in the jungle
let p1Weights = mixer.computeBiomeWeights(-20, 0, placements);
let p1Blended = mixer.blendBiomes(p1Weights);
console.log("[Point 1: Deep Jungle]");
console.log(`Weights: Alien Jungle ${(p1Weights.alien_jungle*100).toFixed(0)}%, Crashed Spacecraft ${(p1Weights.crashed_spacecraft || 0)*100}%`);
console.log(`Primary Biome: ${p1Blended.primaryBiome}`);
console.log(`Transition Detail: ${p1Blended.transitionDetail ? p1Blended.transitionDetail.description : 'None'}\n`);

// Point 2: The clash point (transition zone)
let p2Weights = mixer.computeBiomeWeights(10, 0, placements);
let p2Blended = mixer.blendBiomes(p2Weights);
console.log("[Point 2: Transition Zone]");
console.log(`Weights: Alien Jungle ${(p2Weights.alien_jungle*100).toFixed(0)}%, Crashed Spacecraft ${(p2Weights.crashed_spacecraft*100).toFixed(0)}%`);
console.log(`Transition Detail: ${p2Blended.transitionDetail.description}`);
console.log(`Detailing Rule: ${p2Blended.transitionDetail.detailingRule}`);
console.log(`Geometry Modifier: ${p2Blended.transitionDetail.geometryModifier}\n`);

// Point 3: Deep in the spacecraft
let p3Weights = mixer.computeBiomeWeights(40, 0, placements);
let p3Blended = mixer.blendBiomes(p3Weights);
console.log("[Point 3: Deep Spacecraft]");
console.log(`Weights: Alien Jungle ${(p3Weights.alien_jungle || 0)*100}%, Crashed Spacecraft ${(p3Weights.crashed_spacecraft*100).toFixed(0)}%`);
console.log(`Primary Biome: ${p3Blended.primaryBiome}`);
console.log(`Lighting: ${p3Blended.lighting}\n`);

console.log("=== Biome Test Complete ===");
