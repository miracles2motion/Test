/**
 * Doodle Strike - Enemy Ecosystem Runtime
 * Bridges the Dream Pipeline's wave campaign to the actual game loop.
 */

import { GroupTacticsController } from './ai-group-tactics.js';
import { SpacingController } from './ai-spacing.js';
import { GOD_MODE_TAGS, GOD_MODE_STATS } from './god-mode-tags.js';

export class EnemyRuntime {
  constructor(dreamOutput) {
    this.waveCampaign = dreamOutput.waveCampaign;
    this.mutatedRoster = dreamOutput.mutatedRoster;
    this.bossProfile = dreamOutput.bossProfile;
    this.groupTactics = null;
    this.currentWave = 0;
    this.difficulty = 4; // Mocking difficulty
  }

  onWaveStart(waveNumber, player, mapContext) {
    this.currentWave = waveNumber;
    const waveData = this.waveCampaign[waveNumber - 1];
    if (!waveData) return;
    
    console.log(`\n[RUNTIME] --- WAVE ${waveNumber} START ---`);
    console.log(`Phase: ${waveData.pacingPhase} | Intensity: ${waveData.intensity.toFixed(2)} | Enemies: ${waveData.enemies.length}`);
    
    if (waveData.specialEvent) {
      console.log(`[RUNTIME] *** SPECIAL EVENT TRIGGERED: ${waveData.specialEvent.type} ***`);
      console.log(`          ${waveData.specialEvent.description}`);
    }

    const spawnedEnemies = [];
    
    for (const enemyData of waveData.enemies) {
      // Mocking enemy spawn
      const enemy = { 
        id: enemyData.baseType, 
        health: 100,
        position: { x: Math.random()*20, y: 0, z: Math.random()*20 },
        tags: { ...enemyData.tagOverrides }
      };
      
      this.applyDifficultyLayer(enemy, player, mapContext);
      spawnedEnemies.push(enemy);
    }
    
    if (this.difficulty === 4 && spawnedEnemies.length >= 2) {
      this.groupTactics = new GroupTacticsController(spawnedEnemies, player, mapContext);
      console.log(`[RUNTIME] Group Tactics Enabled for ${spawnedEnemies.length} enemies.`);
    }
  }

  applyDifficultyLayer(enemy, player, mapContext) {
    if (this.difficulty === 4) {
      Object.assign(enemy.tags, GOD_MODE_TAGS);
      Object.assign(enemy, GOD_MODE_STATS);
      enemy.spacingController = new SpacingController(enemy, player, mapContext);
    }
  }
}
