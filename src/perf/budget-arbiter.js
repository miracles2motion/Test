// ============================================================================
// DREAM PHASE 7 - BUDGET ARBITER & FRAME COST MODEL (SYSTEM 1)
// Estimates frame cost and audits blueprints against the 60 FPS contract
// ============================================================================

import { DEVICE_TIERS } from './device-tiers.js';

export class BudgetLedger {
  constructor(tierKey = 'TIER_B') {
    this.tierKey = tierKey;
    this.deviceProfile = DEVICE_TIERS[tierKey] || DEVICE_TIERS.TIER_B;
    this.spent = {
      triangles: { lod0: 0, lod1: 0, lod2: 0 },
      drawCalls: 0,
      uniqueArchetypes: 0,
      instances: 0,
      colliders: { total: 0, perChunkMax: 0 },
      enemies: { concurrentMax: 0, archetypeVariants: 0 },
      geometryMemoryMB: 0,
      predictedFrameMs: 0,
    };
    this.overruns = [];
  }

  reset() {
    this.spent.triangles.lod0 = 0;
    this.spent.triangles.lod1 = 0;
    this.spent.triangles.lod2 = 0;
    this.spent.drawCalls = 0;
    this.spent.uniqueArchetypes = 0;
    this.spent.instances = 0;
    this.spent.colliders.total = 0;
    this.spent.colliders.perChunkMax = 0;
    this.spent.enemies.concurrentMax = 0;
    this.spent.enemies.archetypeVariants = 0;
    this.spent.geometryMemoryMB = 0;
    this.spent.predictedFrameMs = 0;
    this.overruns.length = 0;
  }

  recordArchetype(triangles, memoryMB = 0.5) {
    this.spent.uniqueArchetypes++;
    this.spent.triangles.lod0 += triangles;
    this.spent.geometryMemoryMB += memoryMB;
  }

  recordInstance(count = 1) {
    this.spent.instances += count;
  }

  recordDrawCall(count = 1) {
    this.spent.drawCalls += count;
  }

  recordColliders(count, chunkCount = 1) {
    this.spent.colliders.total += count;
    const perChunk = Math.ceil(this.spent.colliders.total / Math.max(1, chunkCount));
    this.spent.colliders.perChunkMax = Math.max(this.spent.colliders.perChunkMax, perChunk);
  }

  recordEnemies(concurrentMax, variants = 1) {
    this.spent.enemies.concurrentMax = Math.max(this.spent.enemies.concurrentMax, concurrentMax);
    this.spent.enemies.archetypeVariants = Math.max(this.spent.enemies.archetypeVariants, variants);
  }

  estimateFrameMs(frameInterval = 16.67) {
    const k = this.deviceProfile.k;
    const render =
      this.spent.drawCalls * k.drawCall +
      this.spent.triangles.lod0 * k.triangle +
      k.postPass;

    const physics =
      this.spent.colliders.perChunkMax * k.collision *
      (1 + this.spent.enemies.concurrentMax * 0.08);

    const ai =
      this.spent.enemies.concurrentMax * k.enemyTick * 0.75; // AI LOD factor

    const overhead = k.gfxDriver + k.gcHeadroom;

    this.spent.predictedFrameMs = render + physics + ai + overhead;
    return this.spent.predictedFrameMs;
  }

  audit(frameInterval = 16.67) {
    this.overruns.length = 0;
    const p = this.deviceProfile;
    const contractBudgetMs = 0.84 * frameInterval; // 14.0ms at 60 FPS
    const predictedMs = this.estimateFrameMs(frameInterval);

    if (predictedMs > contractBudgetMs) {
      this.overruns.push({
        metric: 'predictedFrameMs',
        value: predictedMs,
        budget: contractBudgetMs,
        diff: predictedMs - contractBudgetMs
      });
    }

    if (this.spent.triangles.lod0 > p.triangleBudget) {
      this.overruns.push({
        metric: 'triangleBudget',
        value: this.spent.triangles.lod0,
        budget: p.triangleBudget,
        diff: this.spent.triangles.lod0 - p.triangleBudget
      });
    }

    if (this.spent.drawCalls > p.drawCallBudget) {
      this.overruns.push({
        metric: 'drawCallBudget',
        value: this.spent.drawCalls,
        budget: p.drawCallBudget,
        diff: this.spent.drawCalls - p.drawCallBudget
      });
    }

    if (this.spent.uniqueArchetypes > p.uniqueArchetypeBudget) {
      this.overruns.push({
        metric: 'uniqueArchetypeBudget',
        value: this.spent.uniqueArchetypes,
        budget: p.uniqueArchetypeBudget,
        diff: this.spent.uniqueArchetypes - p.uniqueArchetypeBudget
      });
    }

    if (this.spent.geometryMemoryMB > p.geometryMemoryBudget) {
      this.overruns.push({
        metric: 'geometryMemoryBudget',
        value: this.spent.geometryMemoryMB,
        budget: p.geometryMemoryBudget,
        diff: this.spent.geometryMemoryMB - p.geometryMemoryBudget
      });
    }

    return {
      passed: this.overruns.length === 0,
      predictedFrameMs: predictedMs,
      contractBudgetMs,
      overruns: this.overruns
    };
  }
}
