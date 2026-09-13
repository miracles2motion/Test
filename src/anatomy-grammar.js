/**
 * Doodle Strike - Anatomy Grammar
 * Defines body sockets and biome-compatible components for synthesizing
 * visual enemy variants.
 */

export class AnatomyGrammar {
  constructor() {
    // Each body part is a "socket"
    this.sockets = {
      head: ['humanoid_skull', 'insectoid_mandible', 'crystalline_cluster', 'cybernetic_visor', 'fungal_cap', 'gargoyle_face', 'holographic_orb'],
      torso: ['humanoid_chest', 'insectoid_thorax', 'crystalline_prism', 'cybernetic_chassis', 'fungal_bulb', 'stone_plate', 'hull_fragment'],
      leftArm: ['humanoid_arm', 'insectoid_claw', 'crystalline_blade', 'cybernetic_arm', 'vine_tendril', 'stone_column', 'shock_blade'],
      rightArm: ['humanoid_arm', 'insectoid_claw', 'crystalline_blade', 'cybernetic_arm', 'vine_tendril', 'stone_column', 'shock_blade'],
      legs: ['humanoid_legs', 'insectoid_legs_4', 'crystalline_pedestal', 'cybernetic_legs', 'root_tendrils', 'stone_pillars', 'hover_thrusters'],
      back: ['none', 'wings_folded', 'wings_spread', 'spore_sacs', 'crystal_spines', 'jetpack', 'cable_bundle', 'banner'],
      aura: ['none', 'bioluminescent_glow', 'frost_mist', 'heat_shimmer', 'electric_arcs', 'shadow_tendrils', 'holographic_glitch']
    };

    // Biome-to-component mapping
    this.biomeComponentMap = {
      alien_jungle: {
        head: ['insectoid_mandible', 'fungal_cap'],
        torso: ['fungal_bulb', 'insectoid_thorax'],
        leftArm: ['vine_tendril', 'insectoid_claw'],
        rightArm: ['vine_tendril', 'insectoid_claw'],
        legs: ['root_tendrils', 'insectoid_legs_4'],
        back: ['spore_sacs', 'wings_spread'],
        aura: ['bioluminescent_glow', 'none']
      },
      gothic_cathedral: {
        head: ['gargoyle_face', 'humanoid_skull'],
        torso: ['stone_plate', 'humanoid_chest'],
        leftArm: ['stone_column', 'humanoid_arm'],
        rightArm: ['stone_column', 'humanoid_arm'],
        legs: ['stone_pillars', 'humanoid_legs'],
        back: ['wings_folded', 'banner', 'none'],
        aura: ['shadow_tendrils', 'none']
      },
      crashed_spacecraft: {
        head: ['cybernetic_visor', 'holographic_orb'],
        torso: ['cybernetic_chassis', 'hull_fragment'],
        leftArm: ['cybernetic_arm', 'shock_blade'],
        rightArm: ['cybernetic_arm', 'shock_blade'],
        legs: ['cybernetic_legs', 'hover_thrusters'],
        back: ['cable_bundle', 'jetpack', 'none'],
        aura: ['electric_arcs', 'holographic_glitch', 'none']
      }
    };
  }

  synthesizeAnatomy(biome, enemyRole, waveIntensity) {
    const anatomy = {};
    const componentPool = this.biomeComponentMap[biome];
    if (!componentPool) return {};

    for (const [socket, components] of Object.entries(componentPool)) {
      const weighted = this.weightByRole(components, enemyRole, waveIntensity);
      anatomy[socket] = this.weightedRandom(weighted);
    }
    
    return anatomy;
  }

  weightByRole(components, role, waveIntensity) {
    const roleWeights = {
      melee: { 'insectoid_claw': 3, 'crystalline_blade': 3, 'shock_blade': 3, 'vine_tendril': 2 },
      ranged: { 'cybernetic_arm': 3, 'humanoid_arm': 2, 'stone_column': 2 },
      aerial: { 'wings_spread': 5, 'hover_thrusters': 4, 'wings_folded': 3 },
      kamikaze: { 'spore_sacs': 4, 'jetpack': 3, 'fungal_bulb': 3 },
      boss: { 'crystal_spines': 4, 'wings_spread': 3, 'cable_bundle': 3, 'spore_sacs': 3 },
    };
    
    return components.map(c => ({
      component: c,
      weight: (roleWeights[role]?.[c] || 1) * (1 + waveIntensity * 0.5)
    }));
  }

  weightedRandom(weightedArray) {
    const total = weightedArray.reduce((sum, item) => sum + item.weight, 0);
    let r = Math.random() * total;
    for (const item of weightedArray) {
      if (r < item.weight) return item.component;
      r -= item.weight;
    }
    return weightedArray[0].component;
  }

  generateBuildProportions(anatomy, role) {
    const proportions = { bodyW: 0.8, bodyH: 1.8, headS: 1.0, limbR: 0.15 };
    
    if (anatomy.torso === 'stone_plate' || anatomy.torso === 'fungal_bulb') {
      proportions.bodyW *= 1.4;
      proportions.bodyH *= 1.1;
      proportions.limbR *= 1.3;
    }
    if (anatomy.torso === 'cybernetic_chassis' || anatomy.torso === 'insectoid_thorax') {
      proportions.bodyW *= 0.8;
      proportions.limbR *= 0.7;
    }
    if (role === 'aerial') {
      proportions.bodyW *= 0.6;
      proportions.bodyH *= 0.7;
      proportions.headS *= 0.8;
    }
    if (role === 'boss') {
      proportions.bodyW *= 2.0;
      proportions.bodyH *= 1.8;
      proportions.headS *= 1.5;
      proportions.limbR *= 1.8;
    }
    
    return proportions;
  }
}
