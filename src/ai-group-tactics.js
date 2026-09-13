/**
 * Doodle Strike - Group Tactics Controller
 * Turns disorganized enemies into a coordinated pack. Enables 'Bait and Switch',
 * 'Vertical Pincer', and other anti-melee tactics.
 */

export class GroupTacticsController {
  constructor(allEnemies, player, mapContext) {
    this.enemies = allEnemies; // Array of enemy objects
    this.player = player;
    this.map = mapContext;
    this.tacticalState = 'SPREAD'; // SPREAD | ENCIRCLE | BAIT_AND_SWITCH | VERTICAL_PINCER
    this.reassessTimer = 0;
    this.reassessInterval = 2.0; // reassess every 2 seconds
  }

  update(dt) {
    this.reassessTimer += dt;
    if (this.reassessTimer < this.reassessInterval) return;
    this.reassessTimer = 0;

    const aliveEnemies = this.enemies.filter(e => e.health > 0);
    if (aliveEnemies.length < 2) return;

    // Simple distance check from the first enemy to the player
    const distToPlayer = aliveEnemies[0].position.distanceTo(this.player.position);
    const playerIsMelee = this.player.currentWeapon === 'sword';

    // --- TACTIC SELECTION ---
    if (playerIsMelee && distToPlayer < 15) {
      this.tacticalState = this.selectAntiMeleeTactic(aliveEnemies);
    } else if (aliveEnemies.length >= 4) {
      this.tacticalState = 'ENCIRCLE';
    } else {
      this.tacticalState = 'SPREAD';
    }

    // --- TACTIC EXECUTION ---
    switch (this.tacticalState) {
      case 'BAIT_AND_SWITCH':
        this.executeBaitAndSwitch(aliveEnemies);
        break;
      case 'ENCIRCLE':
      case 'SPREAD':
        // Default behaviors
        break;
    }
  }

  selectAntiMeleeTactic(enemies) {
    if (enemies.length >= 3) {
      return 'BAIT_AND_SWITCH';
    }
    return 'ENCIRCLE';
  }

  executeBaitAndSwitch(enemies) {
    // BAIT AND SWITCH:
    // One enemy (highest health) stands still and parries.
    // The others flank behind the player and fire.

    const sorted = [...enemies].sort((a, b) => b.health - a.health);
    const bait = sorted[0];
    const switchers = sorted.slice(1);

    // BAIT behavior
    bait.behaviorOverride = {
      tactic: 'BAIT',
      holdPosition: true,
      facePlayer: true,
      parryEnabled: true
    };
    bait.actionLog = bait.actionLog || [];
    if (!bait.actionLog.includes("ACTIVATED BAIT TACTIC")) {
      bait.actionLog.push("ACTIVATED BAIT TACTIC");
    }

    // SWITCH behavior
    // Flank 90 degrees
    const playerForward = this.player.facing || { x: 0, y: 0, z: 1 };
    const leftFlank = {
      x: this.player.position.x - playerForward.z * 8,
      y: this.player.position.y,
      z: this.player.position.z + playerForward.x * 8
    };
    const rightFlank = {
      x: this.player.position.x + playerForward.z * 8,
      y: this.player.position.y,
      z: this.player.position.z - playerForward.x * 8
    };

    switchers.forEach((switcher, i) => {
      const target = i % 2 === 0 ? leftFlank : rightFlank;
      switcher.behaviorOverride = {
        tactic: 'SWITCH',
        movementTarget: target,
        holdFireUntil: 'player_committed_to_bait'
      };
      switcher.actionLog = switcher.actionLog || [];
      if (!switcher.actionLog.includes("FLANKING AS SWITCHER")) {
        switcher.actionLog.push("FLANKING AS SWITCHER");
      }
    });
  }
}
