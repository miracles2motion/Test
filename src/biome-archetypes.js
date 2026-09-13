/**
 * Doodle Strike - Biome Enemy Archetypes
 * Defines unique enemy variants native to specific biomes.
 */

export const BIOME_ENEMY_ARCHETYPES = {
  
  alien_jungle: {
    'Jungle_Stalker': {
      baseType: 'melee',
      description: 'Camouflaged ambush predator that blends into foliage',
      tagOverrides: {
        canCover: true,
        canAmbush: true,
        canCamouflage: true,
        canDropAttack: true,
        canDodge: true,
        canRetreat: true,
      },
      statOverrides: {
        speed: 1.4,
        health: 80, // glass cannon
      },
      anatomy: {
        accessories: ['leaf_cloak', 'clawed_hands'],
      }
    },
    'Spore_Bomber': {
      baseType: 'ranged',
      description: 'Bloated fungal creature that launches toxic spore clouds',
      tagOverrides: {
        canCover: false,
        canRetreat: false,
        canAreaDeny: true,
      },
      statOverrides: {
        speed: 0.6,
        health: 200,
        projectileType: 'spore_cloud',
      },
      anatomy: {
        accessories: ['spore_sacs', 'dripping_mouth'],
      }
    }
  },

  gothic_cathedral: {
    'Gargoyle_Sentinel': {
      baseType: 'ranged',
      description: 'Stone guardian perched on buttresses',
      tagOverrides: {
        canCover: true,
        canDodge: false,  // stone doesn't dodge
        canEchoLocate: true,
      },
      statOverrides: {
        speed: 0.4,
        health: 350,
        armor: 40,
      },
      anatomy: {
        accessories: ['stone_wings_folded', 'cathedral_crest'],
      }
    }
  },

  crashed_spacecraft: {
    'Cybernetic_Hunter': {
      baseType: 'melee',
      description: 'Ship AI drone with targeting lasers',
      tagOverrides: {
        canDodge: true,
        canFlank: true,
        canParry: true,
        canKite: true,
      },
      statOverrides: {
        speed: 1.3,
        health: 150,
        reactionTime: 0.1,
      },
      anatomy: {
        accessories: ['targeting_laser_eye', 'shock_blade_arm'],
      }
    }
  }
};
