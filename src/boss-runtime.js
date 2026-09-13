/**
 * Doodle Strike - Boss Runtime Integration
 * Executes the generated Boss and Arena data in the actual game loop.
 */

export class BossRuntime {
  constructor(bossProfile, arenaData, mapContext) {
    this.boss = bossProfile;
    this.arena = arenaData;
    this.map = mapContext;
    this.currentPhase = 1;
    this.phaseTransitioning = false;
  }

  spawn(bossEntity, playerEntity) {
    this.bossEntity = bossEntity;
    this.player = playerEntity;
    
    // Override the standard think loop with boss-specific AI
    this.bossEntity.think = (dt) => this.bossThink(dt);
    
    // Hook health changes for phase transitions
    this.bossEntity.onDamage = (newHealthPercent) => {
      this.checkPhaseTransition(newHealthPercent);
    };
  }

  bossThink(dt) {
    if (this.phaseTransitioning) return; // Invulnerable/stunned during transition

    const playerDist = this.distanceToPlayer();
    
    switch (this.currentPhase) {
      case 1: this.thinkPhase1(dt, playerDist); break;
      case 2: this.thinkPhase2(dt, playerDist); break;
      case 3: this.thinkPhase3(dt, playerDist); break;
    }
  }

  thinkPhase1(dt, playerDist) {
    // Ground phase: standard combat using ground-level arena features
    if (playerDist > 15) {
      this.logAction("Approaching Player (Ground)");
    } else if (playerDist < 5) {
      this.logAction("Melee Attack");
    } else {
      this.logAction("Ranged Attack");
    }
  }

  thinkPhase2(dt, playerDist) {
    // Vertical phase: boss takes to the high ground
    if (!this.bossEntity.isElevated) {
      this.logAction("Moving to Elevated Arena Feature (e.g. Canopy/Buttress)");
      this.bossEntity.isElevated = true;
    } else {
      // Attack from above
      this.logAction("Executing Arena Interaction: " + (this.boss.arenaInteractions[0]?.interaction || 'BOMBARD'));
    }
  }

  thinkPhase3(dt, playerDist) {
    // Enrage phase: destroy the arena, become aggressive
    this.bossEntity.speed *= 1.5;
    this.logAction("Aggressive Rush (Enraged)");
  }

  checkPhaseTransition(healthPercent) {
    for (const phase of this.boss.phases) {
      if (healthPercent <= phase.healthThreshold && this.currentPhase < phase.phase) {
        this.transitionToPhase(phase.phase);
        break;
      }
    }
  }

  transitionToPhase(newPhase) {
    this.currentPhase = newPhase;
    this.phaseTransitioning = true;
    this.logAction(`--- TRANSITIONING TO PHASE ${newPhase}: ${this.boss.phases[newPhase - 1].name} ---`);
    
    setTimeout(() => {
      this.phaseTransitioning = false;
    }, 2000);
  }

  distanceToPlayer() {
    return Math.sqrt(
      (this.bossEntity.position.x - this.player.position.x)**2 +
      (this.bossEntity.position.z - this.player.position.z)**2
    );
  }

  logAction(action) {
    this.bossEntity.actionLog = this.bossEntity.actionLog || [];
    if (this.bossEntity.actionLog[this.bossEntity.actionLog.length-1] !== action) {
      this.bossEntity.actionLog.push(action);
    }
  }
}
