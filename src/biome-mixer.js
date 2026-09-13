/**
 * Doodle Strike - Biome Mixer
 * Smoothly blends multiple biomes across a map and generates unique transition zones.
 */

export class BiomeMixer {
  constructor(biomeRegistry) {
    this.registry = biomeRegistry;
  }

  // Smoothstep function for organic falloff
  smoothstep(edge0, edge1, x) {
    let t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
    return t * t * (3 - 2 * t);
  }

  computeBiomeWeights(x, z, placements) {
    const weights = {};
    let totalWeight = 0;

    for (const p of placements) {
      const dist = Math.sqrt(Math.pow(x - p.center[0], 2) + Math.pow(z - p.center[2], 2));
      // Smooth falloff
      const t = Math.max(0, 1 - dist / p.radius);
      const smoothT = this.smoothstep(0, 1, t);
      const weight = smoothT * p.weight;
      
      if (weight > 0.01) {
        weights[p.biome] = (weights[p.biome] || 0) + weight;
        totalWeight += weight;
      }
    }

    // Normalize weights
    if (totalWeight > 0) {
      for (const key of Object.keys(weights)) {
        weights[key] /= totalWeight;
      }
    }

    return weights;
  }

  blendBiomes(weights) {
    if (Object.keys(weights).length === 0) return null;

    // Determine the dominant biome for categorical properties
    const sortedBiomes = Object.entries(weights).sort((a, b) => b[1] - a[1]);
    const dominant = sortedBiomes[0][0];
    const dominantData = this.registry[dominant];

    const blended = {
      primaryBiome: dominant,
      geometryLanguage: dominantData.geometryLanguage,
      lighting: dominantData.atmosphere.lighting,
      
      terrainRoughness: 0,
      vegetationDensity: 0,
      sightlineReduction: 0,
      grappleAbundance: 0,
      
      materials: { primary: [], secondary: [], ground: [] },
      transitionDetail: this.generateTransitionDetail(weights)
    };

    // Weighted average for numeric properties
    for (const [biomeKey, weight] of Object.entries(weights)) {
      const data = this.registry[biomeKey];
      
      blended.terrainRoughness += data.terrainRoughness * weight;
      blended.vegetationDensity += data.vegetation.density * weight;
      blended.sightlineReduction += data.gameplayModifiers.sightlineReduction * weight;
      blended.grappleAbundance += data.gameplayModifiers.grappleAbundance * weight;
      
      // Merge materials based on weight threshold
      if (weight > 0.2) {
        blended.materials.primary.push(...data.materials.primary);
        blended.materials.ground.push(...data.materials.ground);
      }
    }

    // Deduplicate materials
    blended.materials.primary = [...new Set(blended.materials.primary)];
    blended.materials.ground = [...new Set(blended.materials.ground)];

    return blended;
  }

  generateTransitionDetail(weights) {
    const sortedBiomes = Object.entries(weights).sort((a, b) => b[1] - a[1]);
    
    // If there is only one biome, or the secondary is very weak, no transition
    if (sortedBiomes.length < 2 || sortedBiomes[1][1] < 0.2) return null;
    
    const primary = sortedBiomes[0][0];
    const secondary = sortedBiomes[1][0];
    const transitionKey = [primary, secondary].sort().join('_');
    
    const transitions = {
      'alien_jungle_crashed_spacecraft': {
        description: 'Reclaimed wreckage',
        detailingRule: 'Metal surfaces get vine wrapping. Torn edges get moss growth. Holographic elements flicker through foliage.',
        geometryModifier: 'Straight metal edges get organic wobble. Flat surfaces get root penetration holes.'
      },
      'alien_jungle_gothic_cathedral': {
        description: 'Overgrown ruins',
        detailingRule: 'Stone surfaces get moss and vine coverage. Stained glass gets cracked with vine penetration.',
        geometryModifier: 'Pointed arches remain but get vine-draped. Floor tiles get displaced by root growth.'
      },
      'crashed_spacecraft_gothic_cathedral': {
        description: 'Sacred wreckage',
        detailingRule: 'Hull metal gets carved with gothic patterns. Emergency lights replaced with candle-like glow.',
        geometryModifier: 'Torn hull sections form accidental pointed arches. Exposed wiring bundles mimic ribbed vaulting.'
      }
    };
    
    return transitions[transitionKey] || null;
  }
}
