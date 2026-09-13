import { BiomeEnemyMutator } from '../src/enemy-mutator.js';
import { BIOME_REGISTRY } from '../src/biome-system.js';
import { BIOME_ENEMY_ARCHETYPES } from '../src/biome-archetypes.js';

console.log("=== Testing Biome-to-Enemy Mutation Engine ===\n");

// Mock existing generic enemies
const BASE_TYPES = {
  grunt: { role: 'ranged', speed: 1.0, health: 100, tags: { canDodge: true } },
  rusher: { role: 'melee', speed: 1.5, health: 80, tags: { canDodge: true, canFlank: true } }
};

const mutator = new BiomeEnemyMutator(BIOME_REGISTRY, BASE_TYPES);

// 1. Mutate for Alien Jungle (wave 10/20)
console.log("[Alien Jungle Mutation (Wave 10)]");
const jungleRoster = mutator.mutateRosterForBiome({ alien_jungle: 1.0 }, 10);
const jungleGrunt = jungleRoster['alien_jungle_grunt'];

console.log(`Original Grunt Speed: ${BASE_TYPES.grunt.speed.toFixed(2)}`);
console.log(`Jungle Grunt Speed: ${jungleGrunt.speed.toFixed(2)} (Faster due to sightline reduction)`);
console.log(`Original Grunt Tags: ${Object.keys(BASE_TYPES.grunt.tags).join(', ')}`);
console.log(`Jungle Grunt Tags: ${Object.keys(jungleGrunt.tags).join(', ')} (Added cover, flank, ambush due to density)`);
console.log(`Jungle Accessories: ${jungleGrunt.accessories.join(', ')}\n`);

// 2. Mutate for Gothic Cathedral (wave 20/20)
console.log("[Gothic Cathedral Mutation (Wave 20)]");
const cathedralRoster = mutator.mutateRosterForBiome({ gothic_cathedral: 1.0 }, 20);
const cathedralRusher = cathedralRoster['gothic_cathedral_rusher'];

console.log(`Original Rusher Tags: ${Object.keys(BASE_TYPES.rusher.tags).join(', ')}`);
console.log(`Cathedral Rusher Tags: ${Object.keys(cathedralRusher.tags).join(', ')} (Added sound-hunting due to acoustics)`);
console.log(`Cathedral Accessories: ${cathedralRusher.accessories.join(', ')}\n`);

// 3. Inspect Biome Archetypes
console.log("[Biome-Specific Archetypes]");
const gargoyle = BIOME_ENEMY_ARCHETYPES.gothic_cathedral['Gargoyle_Sentinel'];
console.log(`Archetype: Gargoyle Sentinel`);
console.log(`Tags: ${Object.keys(gargoyle.tagOverrides).join(', ')} (Notice canDodge is false!)`);

console.log("\n=== Mutation Test Complete ===");
