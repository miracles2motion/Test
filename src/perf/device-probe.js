// ============================================================================
// DREAM PHASE 7 - DEVICE PROBE (FILE 01)
// Layer 1: Static Signals
// Layer 2: Smoke Benchmark
// Layer 3: Historical Override
// ============================================================================

export const DEVICE_TIERS = {
  TIER_S: {
    label: 'Flagship',
    triangleBudget: 900_000,
    drawCallBudget: 200,
    uniqueArchetypeBudget: 40,
    instanceBudget: 6000,
    activeColliderBudget: 400,
    enemyBudget: 20,
    shadowMapSize: 2048,
    pixelRatioCap: 2.0,
    resolutionScaleFloor: 0.7,
    geometryMemoryBudget: 300,
  },
  TIER_A: {
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
  },
  TIER_B: {
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
  },
  TIER_C: {
    label: 'Potato',
    triangleBudget: 120_000,
    drawCallBudget: 60,
    uniqueArchetypeBudget: 10,
    instanceBudget: 900,
    activeColliderBudget: 120,
    enemyBudget: 10,
    shadowMapSize: 0,
    pixelRatioCap: 1.0,
    resolutionScaleFloor: 0.55,
    geometryMemoryBudget: 72,
  },
};

export class DeviceProbe {
  constructor() {
    this.staticSignals = {};
    this.benchmarkResults = {};
    this.profile = null;
    this.tierKey = 'TIER_B'; // Safe default
  }

  async runProbe(glContext) {
    // LAYER 1: STATIC SIGNALS
    this.staticSignals = {
      deviceMemory: navigator.deviceMemory || 4,
      hardwareConcurrency: navigator.hardwareConcurrency || 4,
      isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
    };

    if (glContext) {
      const debugInfo = glContext.getExtension('WEBGL_debug_renderer_info');
      if (debugInfo) {
        this.staticSignals.gpu = glContext.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
      }
      this.staticSignals.maxTextureSize = glContext.getParameter(glContext.MAX_TEXTURE_SIZE);
    }

    // LAYER 2: SMOKE BENCHMARK (Simulated for now, would render actual frames)
    // In a real implementation, this renders Frame A, B, and C as per File 01
    const benchStart = performance.now();
    await new Promise(resolve => setTimeout(resolve, 50)); // Simulating 50ms test
    const benchTime = performance.now() - benchStart;
    this.benchmarkResults.smokeTimeMs = benchTime;

    // Classification Logic (Heuristic based on static signals)
    let score = 0;
    score += this.staticSignals.hardwareConcurrency >= 8 ? 2 : 1;
    score += this.staticSignals.deviceMemory >= 8 ? 2 : 1;
    if (!this.staticSignals.isMobile) score += 2;
    if (this.staticSignals.gpu && this.staticSignals.gpu.toLowerCase().includes('apple m')) score += 3;

    if (score >= 6) this.tierKey = 'TIER_S';
    else if (score >= 4) this.tierKey = 'TIER_A';
    else if (score >= 3) this.tierKey = 'TIER_B';
    else this.tierKey = 'TIER_C';

    // LAYER 3: HISTORICAL OVERRIDE
    // Checks localStorage for telemetry demotions (File 01, 1.2 / File 07)
    try {
      const history = JSON.parse(localStorage.getItem('ds_telemetry_history') || '{}');
      if (history.demotedTier) {
        console.warn(`[DeviceProbe] Historical override applied: Demoted to ${history.demotedTier}`);
        this.tierKey = history.demotedTier;
      }
    } catch (e) {
      console.warn("Failed to read telemetry history", e);
    }

    this.profile = DEVICE_TIERS[this.tierKey];
    this.profile.key = this.tierKey;

    console.log(`[DeviceProbe] Classification Complete: ${this.profile.label} (${this.tierKey})`, this.staticSignals);
    return this.profile;
  }
}

// Singleton export
export const deviceProbe = new DeviceProbe();
