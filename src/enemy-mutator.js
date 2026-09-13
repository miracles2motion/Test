/**
 * Doodle Strike - Biome Enemy Mutator
 * Dynamically mutates existing enemy profiles (stats, tags, aesthetics)
 * to match the map's current biome blend without writing new AI code.
 */

export class BiomeEnemyMutator {
  constructor(biomeRegistry, enemyTypes) {
    this.biomes = biomeRegistry;
    this.baseTypes = enemyTypes; // the existing TYPES object
  }

  mutateRosterForBiome(biomeBlend, waveNumber) {
    const mutatedRoster = {};
    const dominantBiome = this.getDominantBiome(biomeBlend);
    if (!dominantBiome) return this.baseTypes; // fallback
    
    const biomeProfile = this.biomes[dominantBiome];
    const waveIntensity = Math.min(waveNumber / 20, 1.0); // 0-1 over 20 waves

    for (const [typeId, baseEnemy] of Object.entries(this.baseTypes)) {
      const mutation = this.computeMutation(baseEnemy, biomeProfile, waveIntensity, dominantBiome);
      mutatedRoster[`${dominantBiome}_${typeId}`] = {
        ...baseEnemy,
        ...mutation.statOverrides,
        tags: { ...(baseEnemy.tags || {}), ...mutation.tagOverrides },
        build: { ...(baseEnemy.build || {}), ...mutation.anatomyOverrides },
        accessories: [...(baseEnemy.accessories || []), ...mutation.accessoryAdditions],
        biomeVariant: dominantBiome,
        mutationProfile: mutation,
      };
    }

    return mutatedRoster;
  }

  getDominantBiome(biomeBlend) {
    if (!biomeBlend || Object.keys(biomeBlend).length === 0) return null;
    return Object.keys(biomeBlend).reduce((a, b) => biomeBlend[a] > biomeBlend[b] ? a : b);
  }

  computeMutation(baseEnemy, biomeProfile, waveIntensity, dominantBiome) {
    const mutation = {
      statOverrides: {},
      tagOverrides: {},
      anatomyOverrides: {},
      accessoryAdditions: [],
    };

    // --- STAT MUTATIONS ---
    if (biomeProfile.gameplayModifiers.sightlineReduction > 0.2) {
      mutation.statOverrides.speed = (baseEnemy.speed || 1.0) * 
        (1 + biomeProfile.gameplayModifiers.sightlineReduction * 0.5 * waveIntensity);
    }
    if (biomeProfile.terrainRoughness > 0.4) {
      mutation.statOverrides.health = (baseEnemy.health || 100) * 
        (1 + biomeProfile.terrainRoughness * 0.3 * waveIntensity);
    }
    if (biomeProfile.materials.primary.some(m => m.includes('metal') || m.includes('hull'))) {
      mutation.statOverrides.armor = (baseEnemy.armor || 0) + Math.floor(20 * waveIntensity);
    }

    // --- TAG MUTATIONS ---
    if (biomeProfile.vegetation.density > 0.5) {
      mutation.tagOverrides.canCover = true;
      mutation.tagOverrides.canFlank = true;
      mutation.tagOverrides.canAmbush = true;
    }
    if (biomeProfile.gameplayModifiers.verticalityBonus > 1.2) {
      mutation.tagOverrides.canGrapple = true;
      mutation.tagOverrides.canVerticalEscape = true;
      if (baseEnemy.role === 'melee') {
        mutation.tagOverrides.canDropAttack = true;
      }
    }
    if (biomeProfile.gameplayModifiers.audioMuffling < 0) {
      mutation.tagOverrides.canSoundHunt = true;
      mutation.tagOverrides.canEchoLocate = true;
    }

    // --- ANATOMY & ACCESSORY MUTATIONS ---
    if (dominantBiome === 'alien_jungle') {
      mutation.accessoryAdditions.push('vine_wrapping', 'spore_emitter');
    } else if (dominantBiome === 'gothic_cathedral') {
      mutation.accessoryAdditions.push('stone_armor_plates', 'candle_crown');
    } else if (dominantBiome === 'crashed_spacecraft') {
      mutation.accessoryAdditions.push('cybernetic_arm', 'cracked_visor');
    }

    mutation.anatomyOverrides.colorPalette = this.deriveColorPalette(biomeProfile);

    return mutation;
  }

  deriveColorPalette(biomeProfile) {
    const materialColors = {
      'bark': [0.35, 0.22, 0.12],
      'moss': [0.2, 0.45, 0.15],
      'carved_stone': [0.5, 0.48, 0.45],
      'torn_hull_metal': [0.4, 0.42, 0.45]
    };
    const primaryMat = biomeProfile.materials.primary[0];
    const secondaryMat = biomeProfile.materials.secondary[0];
    
    return {
      skin: materialColors[primaryMat] || [0.5, 0.5, 0.5],
      accent: materialColors[secondaryMat] || [0.7, 0.7, 0.7]
    };
  }
}
