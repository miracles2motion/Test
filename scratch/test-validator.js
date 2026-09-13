import { SpatialValidator } from '../src/spatial-validator.js';

const mockLLMOutput = {
  "metadata": {
    "mapName": "Test Map",
    "theme": "cyber_city"
  },
  "regions": [
    { "id": "arena_1" },
    { "id": "sniper_tower" } // sniper_tower is a dead end
  ],
  "connections": [
    // intentionally left empty so both are dead ends
  ],
  "gameplayElements": {
    "spawns": [
      { "position": [0, 10, 0], "protection": "exposed" } // bad spawn
    ],
    "grapplePoints": [
      { "position": [0, 0, 0] },
      { "position": [100, 0, 0] } // 100m away, isolated
    ]
  }
};

const validator = new SpatialValidator();
const result = validator.validateAndRepair(mockLLMOutput);

console.log("Validation Result:");
console.log("Errors:", result.errors);
console.log("Warnings (Healed):", result.warnings);
console.log("Repaired Spawn Protection:", result.repaired.gameplayElements.spawns[0].protection);
console.log("Repaired Grapple 2 Position:", result.repaired.gameplayElements.grapplePoints[1].position);
console.log("Total Connections After Healing:", result.repaired.connections.length);
