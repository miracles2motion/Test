import { SpacingController } from '../src/ai-spacing.js';
import { GroupTacticsController } from '../src/ai-group-tactics.js';
import { GOD_MODE_TAGS, GOD_MODE_STATS } from '../src/god-mode-tags.js';

console.log("=== Testing God Mode Melee Defense ===\n");

// 1. Mock Player (Melee Rusher)
const player = {
  position: { x: 0, y: 0, z: 0 },
  velocity: { x: 0, y: 0, z: 8.0 }, // sprinting straight down Z axis
  currentWeapon: 'sword',
  facing: { x: 0, y: 0, z: 1 } // facing forward
};

function distanceTo(otherPos) {
  return Math.sqrt((this.x - otherPos.x)**2 + (this.y - otherPos.y)**2 + (this.z - otherPos.z)**2);
}
player.position.distanceTo = distanceTo.bind(player.position);

// 2. Mock Enemies
class MockEnemy {
  constructor(id, x, z, health) {
    this.id = id;
    this.position = { x, y: 0, z, distanceTo: distanceTo };
    this.position.distanceTo = this.position.distanceTo.bind(this.position);
    this.health = health;
    this.tags = { ...GOD_MODE_TAGS };
    this.stats = { ...GOD_MODE_STATS };
    this.actionLog = [];
    this.grenadeCooldown = 0;
  }
}

const e1 = new MockEnemy('Heavy (Bait)', 0, 10, 200); // 10m ahead
const e2 = new MockEnemy('Grunt (Switcher 1)', -2, 12, 100);
const e3 = new MockEnemy('Grunt (Switcher 2)', 2, 12, 100);

const allEnemies = [e1, e2, e3];
const mapContext = {}; // Mock map

// 3. Spacing Controller Test (Kiting)
console.log("[Test 1: Spacing Controller (Kiting)]");
const spacingController = new SpacingController(e1, player, mapContext);
spacingController.update(0.1); // Process 1 frame
console.log(`Enemy 1 State: ${spacingController.spacingState}`);
console.log(`Enemy 1 Target Position: [${e1.movementTarget.x.toFixed(1)}, ${e1.movementTarget.y.toFixed(1)}, ${e1.movementTarget.z.toFixed(1)}] (Notice it's moving AWAY and strafing)`);

// 4. Panic Dodge Test
console.log("\n[Test 2: Panic Dodge (Player reaches 1m)]");
player.position.z = 9.0; // Player is now 1m away from e1
spacingController.update(0.1);
console.log(`Enemy 1 State: ${spacingController.spacingState}`);
console.log(`Enemy 1 Impulse Vector: [${e1.impulse.x.toFixed(1)}, ${e1.impulse.y.toFixed(1)}, ${e1.impulse.z.toFixed(1)}] (Jumping BACKWARDS and UP)`);
console.log(`Enemy 1 Action Log: ${e1.actionLog.join(", ")}`);

// 5. Group Tactics Test (Bait and Switch)
console.log("\n[Test 3: Group Tactics (Bait and Switch)]");
player.position.z = 2.0; // Player is 8m away
const tacticsController = new GroupTacticsController(allEnemies, player, mapContext);
tacticsController.update(2.1); // trigger reassess

console.log(`Tactical State: ${tacticsController.tacticalState}`);
console.log(`Enemy 1 (Heavy) Override: ${e1.behaviorOverride.tactic}`);
console.log(`Enemy 1 (Heavy) Action Log: ${e1.actionLog[e1.actionLog.length-1]}`);
console.log(`Enemy 2 (Grunt 1) Override: ${e2.behaviorOverride.tactic} -> Target [${e2.behaviorOverride.movementTarget.x}, ${e2.behaviorOverride.movementTarget.y}, ${e2.behaviorOverride.movementTarget.z}] (Left Flank)`);
console.log(`Enemy 3 (Grunt 2) Override: ${e3.behaviorOverride.tactic} -> Target [${e3.behaviorOverride.movementTarget.x}, ${e3.behaviorOverride.movementTarget.y}, ${e3.behaviorOverride.movementTarget.z}] (Right Flank)`);

console.log("\n=== God Mode Tests Complete ===");
