/**
 * Doodle Strike - Wave Composer
 * Replaces linear scaling with a dramatic pacing curve and biome events.
 */

export class WaveComposer {
  constructor(biomeContext, difficulty) {
    this.biome = biomeContext;
    this.difficulty = difficulty;
  }

  composeFullCampaign(totalWaves, availableArchetypes, bossWave = null) {
    const campaign = [];
    
    for (let wave = 1; wave <= totalWaves; wave++) {
      campaign.push(this.composeWave(wave, totalWaves, availableArchetypes));
    }
    
    if (bossWave) {
      campaign.splice(bossWave.waveNumber - 1, 1, bossWave);
    }
    
    return campaign;
  }

  composeWave(waveNumber, totalWaves, archetypes) {
    const progress = waveNumber / totalWaves;
    
    // Pacing Curve: INTRO -> ESCALATION -> REST -> SURGE -> CLIMAX -> BOSS
    const pacingPhase = this.getPacingPhase(waveNumber, totalWaves);
    const intensityMultiplier = this.getIntensityMultiplier(pacingPhase, progress);
    
    const baseCount = 3 + Math.floor(progress * 8);
    const count = Math.round(baseCount * intensityMultiplier);
    
    const composition = this.selectComposition(archetypes, pacingPhase, progress, count);
    
    // Spawn Placement & Special Events (mocked for topology/events)
    const specialEvent = this.rollSpecialEvent(waveNumber, pacingPhase, this.biome);
    
    return {
      waveNumber,
      pacingPhase,
      intensity: intensityMultiplier,
      enemies: composition,
      specialEvent,
    };
  }

  getPacingPhase(waveNumber, totalWaves) {
    const progress = waveNumber / totalWaves;
    if (progress <= 0.15) return 'INTRO';
    if (progress <= 0.40) return 'ESCALATION';
    if (progress <= 0.50) return 'REST';
    if (progress <= 0.75) return 'SURGE';
    if (progress <= 0.85) return 'REST_SHORT';
    if (progress <= 0.95) return 'CLIMAX';
    return 'BOSS';
  }

  getIntensityMultiplier(phase, progress) {
    const multipliers = {
      'INTRO': 0.4 + progress * 1.5,
      'ESCALATION': 0.6 + progress * 1.0,
      'REST': 0.5,
      'SURGE': 0.8 + progress * 0.5,
      'REST_SHORT': 0.6,
      'CLIMAX': 1.0 + progress * 0.5,
      'BOSS': 1.2,
    };
    return multipliers[phase] || 1.0;
  }

  selectComposition(archetypes, phase, progress, count) {
    const composition = [];
    const keys = Object.keys(archetypes);
    if (keys.length === 0) return composition;

    for (let i = 0; i < count; i++) {
      // Basic random selection for mock
      const randomKey = keys[Math.floor(Math.random() * keys.length)];
      composition.push(archetypes[randomKey]);
    }
    return composition;
  }

  rollSpecialEvent(waveNumber, phase, biome) {
    if (phase !== 'SURGE' && phase !== 'CLIMAX') return null;
    if (Math.random() > 0.5) return null; // 50% chance during surge/climax for test
    
    const dominant = biome.dominantBiome || biome;
    const events = {
      alien_jungle: [{ type: 'SPORE_STORM', description: 'Toxic spore cloud reduces visibility.' }],
      gothic_cathedral: [{ type: 'BELL_TOLL', description: 'Cathedral bell rings, stunning enemies.' }],
      crashed_spacecraft: [{ type: 'REACTOR_SURGE', description: 'Reactor pulses, disabling grapples.' }]
    };
    
    const biomeEvents = events[dominant] || [];
    if (biomeEvents.length === 0) return null;
    
    return biomeEvents[Math.floor(Math.random() * biomeEvents.length)];
  }
}
