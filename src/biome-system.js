/**
 * Doodle Strike - Biome System Registry
 * Defines the fundamental laws of reality for different ecosystems.
 */

export const BIOME_REGISTRY = {
  
  'alien_jungle': {
    geometryLanguage: 'organic',
    terrainGenerator: 'voxel',
    terrainRoughness: 0.7,
    
    vegetation: {
      density: 0.8,
      lsystemGrammars: ['TREE', 'VINE', 'MUSHROOM'],
      maxHeight: 25,
      canopyCoverage: 0.6,
      groundCover: 'dense'
    },
    
    materials: {
      primary: ['bark', 'moss', 'alien_flesh'],
      secondary: ['bioluminescent_gel', 'crystal_vein'],
      ground: ['mud', 'root_mat', 'spore_carpet']
    },
    
    atmosphere: {
      lighting: 'bioluminescent',
      fog: 0.4,
      fogColor: [0.1, 0.3, 0.2],
      ambientSound: 'jungle_ambience',
      verticalVisibility: 15
    },
    
    gameplayModifiers: {
      sightlineReduction: 0.3,  // Vegetation blocks 30% of sightlines
      audioMuffling: 0.4,       // Dense foliage muffles footsteps
      grappleAbundance: 1.5,    // 50% more grapple points (vines everywhere)
      verticalityBonus: 1.3,
      coverType: 'soft'
    },
    
    generationRules: {
      maxStraightSegmentLength: 4.0,  // meters before a wobble is forced
      minBranchingDensity: 0.3,
      canopyLayerRequired: true,
      groundUndulationMin: 0.5
    }
  },

  'gothic_cathedral': {
    geometryLanguage: 'pointed_arch',
    terrainGenerator: 'flat_with_vaults',
    terrainRoughness: 0.1,
    
    vegetation: { density: 0.05, lsystemGrammars: ['VINE'], maxHeight: 3 },
    
    materials: {
      primary: ['carved_stone', 'stained_glass', 'dark_wood'],
      secondary: ['iron_filigree', 'candle_wax', 'marble'],
      ground: ['stone_tile', 'worn_flagstone', 'carpet_runner']
    },
    
    atmosphere: {
      lighting: 'candlelight_with_god_rays',
      fog: 0.15,
      fogColor: [0.2, 0.15, 0.1],
      ambientSound: 'echoing_cathedral',
      verticalVisibility: 40 // Massive vaulted ceilings
    },
    
    gameplayModifiers: {
      sightlineReduction: 0.1,
      audioMuffling: -0.3,       // Negative muffling = echoes AMPLIFY sound
      grappleAbundance: 0.8,     // Fewer grapple points
      verticalityBonus: 1.5,
      coverType: 'hard'
    },
    
    generationRules: {
      maxStraightSegmentLength: 20.0,
      minBranchingDensity: 0.0,
      canopyLayerRequired: false,
      groundUndulationMin: 0.0,
      archType: 'pointed',
      vaultType: 'ribbed',
      minCeilingHeight: 8.0
    }
  },

  'crashed_spacecraft': {
    geometryLanguage: 'fractured_industrial',
    terrainGenerator: 'voxel_with_debris',
    terrainRoughness: 0.5,
    
    vegetation: { density: 0.15, lsystemGrammars: ['VINE', 'MUSHROOM'], maxHeight: 5 },
    
    materials: {
      primary: ['torn_hull_metal', 'exposed_wiring', 'carbon_scoring'],
      secondary: ['flickering_hologram', 'coolant_leak', 'alien_resin'],
      ground: ['buckled_deck_plating', 'cratered_earth', 'scattered_debris']
    },
    
    atmosphere: {
      lighting: 'emergency_red_with_sparks',
      fog: 0.25,
      fogColor: [0.15, 0.05, 0.05],
      ambientSound: 'groaning_metal_and_hiss',
      verticalVisibility: 25
    },
    
    gameplayModifiers: {
      sightlineReduction: 0.2,
      audioMuffling: 0.1,
      grappleAbundance: 1.2,    // Exposed cables and torn hull edges
      verticalityBonus: 1.2,
      coverType: 'mixed'
    },
    
    generationRules: {
      maxStraightSegmentLength: 8.0,
      minBranchingDensity: 0.05,
      canopyLayerRequired: false,
      groundUndulationMin: 0.3,
      fractureIntensity: 0.6,
      tiltAngleRange: [-15, 25]  // The whole ship is tilted/crashed
    }
  }
};
