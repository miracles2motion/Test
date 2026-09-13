// ============================================================================
// DREAM PHASE 7 - DEVICE PROBE (SYSTEM 1)
// Layer 1: Static Signals
// Layer 2: Smoke Benchmark
// Layer 3: Historical Override
// ============================================================================

import { DEVICE_TIERS } from './device-tiers.js';

export { DEVICE_TIERS };

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
      deviceMemory: typeof navigator !== 'undefined' ? (navigator.deviceMemory || 4) : 4,
      hardwareConcurrency: typeof navigator !== 'undefined' ? (navigator.hardwareConcurrency || 4) : 4,
      isMobile: typeof navigator !== 'undefined' ? /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) : false,
    };

    if (glContext) {
      const debugInfo = glContext.getExtension('WEBGL_debug_renderer_info');
      if (debugInfo) {
        this.staticSignals.gpu = glContext.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
      }
      this.staticSignals.maxTextureSize = glContext.getParameter(glContext.MAX_TEXTURE_SIZE);
    }

    // LAYER 2: SMOKE BENCHMARK (Simulated warmup / timing)
    const benchStart = performance.now();
    await new Promise(resolve => setTimeout(resolve, 30));
    const benchTime = performance.now() - benchStart;
    this.benchmarkResults.smokeTimeMs = benchTime;

    // Classification Heuristic
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
    try {
      if (typeof localStorage !== 'undefined') {
        const history = JSON.parse(localStorage.getItem('ds_telemetry_history') || '{}');
        if (history.demotedTier) {
          console.warn(`[DeviceProbe] Historical override applied: Demoted to ${history.demotedTier}`);
          this.tierKey = history.demotedTier;
        }
      }
    } catch (e) {
      console.warn("Failed to read telemetry history", e);
    }

    this.profile = DEVICE_TIERS[this.tierKey] || DEVICE_TIERS.TIER_B;

    console.log(`[DeviceProbe] Classification Complete: ${this.profile.label} (${this.tierKey})`, this.staticSignals);
    return this.profile;
  }
}

export const deviceProbe = new DeviceProbe();
