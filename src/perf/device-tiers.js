// ============================================================================
// DREAM PHASE 7 - DEVICE TIERS (FILE 01 / SYSTEM 1)
// Tier contracts & budget definitions
// ============================================================================

export const DEVICE_TIERS = {
  TIER_S: {
    key: 'TIER_S',
    label: 'Flagship',
    triangleBudget: 900_000,   // per frame, LOD0-visible
    drawCallBudget: 200,
    uniqueArchetypeBudget: 40, // distinct geometries (pre-instance)
    instanceBudget: 6000,
    activeColliderBudget: 400, // primitives in active collision chunks
    enemyBudget: 20,           // concurrent ACTIVE enemies
    shadowMapSize: 2048,
    pixelRatioCap: 2.0,
    resolutionScaleFloor: 0.7,
    geometryMemoryBudget: 300, // MB, all LOD levels combined
    k: {
      drawCall: 0.015,
      triangle: 0.000008,
      postPass: 1.8,
      collision: 0.003,
      enemyTick: 0.12,
      gfxDriver: 1.5,
      gcHeadroom: 2.0,
    }
  },
  TIER_A: {
    key: 'TIER_A',
    label: 'Upper-Mid',
    triangleBudget: 500_000,
    drawCallBudget: 140,
    uniqueArchetypeBudget: 28,
    instanceBudget: 3500,
    activeColliderBudget: 280,
    enemyBudget: 16,
    shadowMapSize: 1024,
    pixelRatioCap: 1.75,
    resolutionScaleFloor: 0.65,
    geometryMemoryBudget: 200,
    k: {
      drawCall: 0.022,
      triangle: 0.000012,
      postPass: 2.5,
      collision: 0.0045,
      enemyTick: 0.18,
      gfxDriver: 2.0,
      gcHeadroom: 2.5,
    }
  },
  TIER_B: {
    key: 'TIER_B',
    label: 'Mid',
    triangleBudget: 300_000,
    drawCallBudget: 100,
    uniqueArchetypeBudget: 18,
    instanceBudget: 2000,
    activeColliderBudget: 200,
    enemyBudget: 13,
    shadowMapSize: 1024,
    pixelRatioCap: 1.5,
    resolutionScaleFloor: 0.6,
    geometryMemoryBudget: 128,
    k: {
      drawCall: 0.035,
      triangle: 0.000020,
      postPass: 3.6,
      collision: 0.007,
      enemyTick: 0.28,
      gfxDriver: 2.8,
      gcHeadroom: 3.0,
    }
  },
  TIER_C: {
    key: 'TIER_C',
    label: 'Potato',
    triangleBudget: 120_000,
    drawCallBudget: 60,
    uniqueArchetypeBudget: 10,
    instanceBudget: 900,
    activeColliderBudget: 120,
    enemyBudget: 10,
    shadowMapSize: 0,          // dynamic shadows OFF at boot
    pixelRatioCap: 1.0,
    resolutionScaleFloor: 0.55,
    geometryMemoryBudget: 72,
    k: {
      drawCall: 0.055,
      triangle: 0.000035,
      postPass: 5.0,
      collision: 0.012,
      enemyTick: 0.45,
      gfxDriver: 3.5,
      gcHeadroom: 3.5,
    }
  },
};
