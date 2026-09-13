/**
 * Doodle Strike - Spacing Controller
 * Solves the "Melee Cheese" problem by giving AI awareness of optimal engagement 
 * distances, allowing them to kite, panic-dodge backwards, and ambush.
 */

export class SpacingController {
  constructor(enemy, player, mapContext) {
    this.enemy = enemy;
    this.player = player;
    this.map = mapContext;
    
    // Distance thresholds (meters)
    this.meleeThreatRange = 3.5;    // player's sword reach + lunge
    this.optimalRange = 15.0;       // where AI weapons are most effective
    this.panicRange = 2.0;          // emergency: player is ON TOP of us
    this.grappleThreatRange = 20.0; // player can grapple-close from here
    
    // State machine
    this.spacingState = 'HOLDING'; // HOLDING | KITING | PANIC | AMBUSH
    this.kiteTimer = 0;
  }

  update(dt) {
    const distToPlayer = this.enemy.position.distanceTo(this.player.position);
    const playerVelocity = this.player.velocity || [0,0,0];
    
    // Simplified velocity dot product for testing
    const dirToEnemy = [
      this.enemy.position.x - this.player.position.x,
      this.enemy.position.y - this.player.position.y,
      this.enemy.position.z - this.player.position.z
    ];
    const dirMag = Math.sqrt(dirToEnemy[0]**2 + dirToEnemy[1]**2 + dirToEnemy[2]**2);
    const normDir = dirMag > 0 ? [dirToEnemy[0]/dirMag, dirToEnemy[1]/dirMag, dirToEnemy[2]/dirMag] : [0,0,0];
    const approachSpeed = (playerVelocity[0]*normDir[0] + playerVelocity[1]*normDir[1] + playerVelocity[2]*normDir[2]);
    
    const playerApproaching = approachSpeed > 2.0;
    
    // --- DETECT MELEE RUSH ---
    const isMeleeRush = this.detectMeleeRush(distToPlayer, approachSpeed);
    
    if (distToPlayer < this.panicRange) {
      this.spacingState = 'PANIC';
      this.executePanicEscape(dt);
    } else if (isMeleeRush) {
      this.spacingState = 'KITING';
      this.executeKite(dt, distToPlayer);
    } else if (distToPlayer < this.meleeThreatRange && playerApproaching) {
      this.spacingState = 'KITING';
      this.executeKite(dt, distToPlayer);
    } else if (distToPlayer > this.optimalRange * 1.5) {
      this.spacingState = 'AMBUSH';
      this.executeAmbushReposition(dt);
    } else {
      this.spacingState = 'HOLDING';
      this.executeHoldPosition(dt);
    }
  }

  detectMeleeRush(distToPlayer, approachSpeed) {
    if (distToPlayer > this.grappleThreatRange) return false;
    if (approachSpeed < 5.0) return false; // not rushing fast enough
    
    const isMeleeWeapon = this.player.currentWeapon === 'sword';
    return isMeleeWeapon; // Mocking line-of-sight for simplicity
  }

  executeKite(dt, distToPlayer) {
    // Kiting is maintaining optimal distance while continuing to fire.
    // 1. BACKPEDAL + STRAFE at an angle
    const awayDir = [
      this.enemy.position.x - this.player.position.x,
      0, // keep ground level
      this.enemy.position.z - this.player.position.z
    ];
    const mag = Math.sqrt(awayDir[0]**2 + awayDir[2]**2);
    const normAway = mag > 0 ? [awayDir[0]/mag, 0, awayDir[2]/mag] : [1,0,0];
    const perpendicular = [-normAway[2], 0, normAway[0]]; // 90 degrees
    
    this.kiteTimer += dt;
    const strafeSign = Math.sin(this.kiteTimer * 2.1) > 0 ? 1 : -1;
    
    const kiteVector = [
      normAway[0] * 0.7 + perpendicular[0] * 0.3 * strafeSign,
      0,
      normAway[2] * 0.7 + perpendicular[2] * 0.3 * strafeSign
    ];
    
    this.enemy.movementTarget = {
      x: this.enemy.position.x + kiteVector[0] * 8,
      y: this.enemy.position.y,
      z: this.enemy.position.z + kiteVector[2] * 8
    };
    
    // 2. FIRE WHILE RETREATING
    this.enemy.forceContinuousFire = true;
  }

  executePanicEscape(dt) {
    // 1. DODGE BACKWARD (not lateral!)
    const awayDir = [
      this.enemy.position.x - this.player.position.x,
      this.enemy.position.y - this.player.position.y,
      this.enemy.position.z - this.player.position.z
    ];
    const mag = Math.sqrt(awayDir[0]**2 + awayDir[1]**2 + awayDir[2]**2);
    const normAway = mag > 0 ? [awayDir[0]/mag, awayDir[1]/mag, awayDir[2]/mag] : [1,0,0];
    
    // Impulse backward and upward
    this.enemy.impulse = {
      x: normAway[0] * 8,
      y: 6.0,
      z: normAway[2] * 8
    };
    
    // 2. DEPLOY AREA DENIAL (drop grenade at feet)
    if (this.enemy.tags.canAreaDeny && this.enemy.grenadeCooldown <= 0) {
      this.enemy.actionLog = this.enemy.actionLog || [];
      this.enemy.actionLog.push("DROPPED PANIC GRENADE AT FEET");
      this.enemy.grenadeCooldown = 5.0;
    }
  }

  executeHoldPosition(dt) {
    this.enemy.forceContinuousFire = true;
    this.enemy.movementTarget = null;
  }

  executeAmbushReposition(dt) {
    // Find cover spot and wait
    this.enemy.movementTarget = { x: 0, y: 0, z: 0 }; // Mock ambush spot
  }
}
