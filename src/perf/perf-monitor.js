// ============================================================================
// DREAM PHASE 7 - ADAPTIVE PERFORMANCE MONITOR (SYSTEM 4)
// Zero-allocation p95 tracker, combat deferral, and quality degradation ladder
// ============================================================================

export const PERF_CONFIG = {
  sampleCount: 240,             // 4 seconds of history at 60fps
  degradeThresholdRatio: 1.092, // ~18.2ms @ 60fps (p95)
  degradeSustainMs: 2000,       // 2.0s
  recoverThresholdRatio: 0.930, // ~15.5ms @ 60fps (p50)
  recoverSustainMs: 10_000,     // 10.0s
  dwellTimeMs: 2500,            // minimum time between rung downgrades
  shadowRecoverSustainMs: 30_000,
  spikeRatio: 3.0,              // 50ms spike @ 60fps
};

export class AdaptivePerformanceMonitor {
  constructor() {
    this.samples = new Float32Array(PERF_CONFIG.sampleCount);
    this.sorted = new Float32Array(PERF_CONFIG.sampleCount);
    this.index = 0;
    this.filled = 0;

    this.frameInterval = 16.67; // default 60 FPS
    this.rung = 0;              // 0=Full, 1=NoShadows, 2=NoDoubleStroke, 3=ResScale, 4=BgCull, 5=Survival
    this.resSubRung = 0;        // 0=1.0, 1=0.9, 2=0.8, 3=0.7, 4=0.6
    this.rungAt = 0;
    this.lastSecondAt = 0;
    this.healthyDurationMs = 0;
    this.degradeDurationMs = 0;

    this.inCombat = false;
    this.deferredRung = null;

    // Quality state targets to be read by renderer
    this.quality = {
      shadows: true,
      doubleStroke: true,
      resolutionScale: 1.0,
      bgCullRadius: 200,
      survivalMode: false,
      compensationUniforms: {
        dotPitch: 1.0,
        hatchStep: 1.0,
      }
    };

    // Telemetry
    this.p95Ms = 16.67;
    this.p50Ms = 16.67;
    this.spikeCount = 0;
  }

  setFrameInterval(intervalMs) {
    this.frameInterval = intervalMs;
  }

  setCombatState(inCombat) {
    this.inCombat = inCombat;
    if (!this.inCombat && this.deferredRung !== null) {
      const now = performance.now();
      this.applyRung(this.deferredRung, now);
      this.deferredRung = null;
    }
  }

  // Zero-allocation frame tick
  tick(dtMs, now = performance.now()) {
    this.samples[this.index] = dtMs;
    this.index = (this.index + 1) % PERF_CONFIG.sampleCount;
    if (this.filled < PERF_CONFIG.sampleCount) this.filled++;

    if (dtMs > this.frameInterval * PERF_CONFIG.spikeRatio) {
      this.spikeCount++;
    }

    if (this.filled >= 60 && now - this.lastSecondAt >= 1000) {
      this.evaluate(now);
      this.lastSecondAt = now;
    }
  }

  percentiles() {
    this.sorted.set(this.samples);
    // In-place insertion sort (O(N) on nearly-sorted arrays)
    const n = this.filled;
    for (let i = 1; i < n; i++) {
      const v = this.sorted[i];
      let j = i - 1;
      while (j >= 0 && this.sorted[j] > v) {
        this.sorted[j + 1] = this.sorted[j];
        j--;
      }
      this.sorted[j + 1] = v;
    }

    const p50 = this.sorted[Math.floor(n * 0.50)];
    const p95 = this.sorted[Math.floor(n * 0.95)];
    return { p50, p95 };
  }

  evaluate(now) {
    const { p50, p95 } = this.percentiles();
    this.p50Ms = p50;
    this.p95Ms = p95;

    const degradeThreshold = this.frameInterval * PERF_CONFIG.degradeThresholdRatio;
    const recoverThreshold = this.frameInterval * PERF_CONFIG.recoverThresholdRatio;

    // Survival mode emergency trigger
    if (p95 > 40.0) {
      this.applyRung(5, now, true); // bypass deferral
      return;
    }

    if (p95 > degradeThreshold) {
      this.degradeDurationMs += 1000;
      this.healthyDurationMs = 0;

      if (this.degradeDurationMs >= PERF_CONFIG.degradeSustainMs) {
        if (now - this.rungAt >= PERF_CONFIG.dwellTimeMs) {
          this.stepDegrade(now);
          this.degradeDurationMs = 0;
        }
      }
    } else if (p50 < recoverThreshold) {
      this.healthyDurationMs += 1000;
      this.degradeDurationMs = 0;

      if (this.healthyDurationMs >= PERF_CONFIG.recoverSustainMs) {
        this.stepRecover(now);
        this.healthyDurationMs = 0;
      }
    } else {
      this.degradeDurationMs = 0;
    }
  }

  stepDegrade(now) {
    if (this.rung === 0) {
      this.requestRung(1, now); // Shadows off
    } else if (this.rung === 1) {
      this.requestRung(2, now); // Double-stroke off
    } else if (this.rung === 2) {
      this.rung = 3;
      this.resSubRung = 1;
      this.requestRung(3, now); // Res scale 0.9
    } else if (this.rung === 3) {
      if (this.resSubRung < 4) {
        this.resSubRung++;
        this.applyQuality();
        this.rungAt = now;
      } else {
        this.requestRung(4, now); // Bg cull
      }
    }
  }

  stepRecover(now) {
    if (this.rung === 5) {
      this.requestRung(4, now);
    } else if (this.rung === 4) {
      this.requestRung(3, now);
      this.resSubRung = 4;
    } else if (this.rung === 3) {
      if (this.resSubRung > 0) {
        this.resSubRung--;
        this.applyQuality();
        this.rungAt = now;
      } else {
        this.requestRung(2, now);
      }
    } else if (this.rung === 2) {
      this.requestRung(1, now);
    } else if (this.rung === 1) {
      if (this.healthyDurationMs >= PERF_CONFIG.shadowRecoverSustainMs) {
        this.requestRung(0, now);
      }
    }
  }

  requestRung(targetRung, now, immediate = false) {
    if (!immediate && this.inCombat && targetRung > this.rung) {
      this.deferredRung = targetRung;
      return;
    }
    this.applyRung(targetRung, now);
  }

  applyRung(targetRung, now) {
    this.rung = targetRung;
    this.rungAt = now;
    this.applyQuality();
  }

  applyQuality() {
    // Rung 0: Full
    // Rung 1: Shadows off
    // Rung 2: Double-stroke off
    // Rung 3: Resolution scale
    // Rung 4: Background culling
    // Rung 5: Survival
    this.quality.shadows = this.rung < 1;
    this.quality.doubleStroke = this.rung < 2;

    if (this.rung < 3) {
      this.quality.resolutionScale = 1.0;
    } else if (this.rung === 3) {
      const scales = [1.0, 0.9, 0.8, 0.7, 0.6];
      this.quality.resolutionScale = scales[this.resSubRung] || 0.6;
    } else {
      this.quality.resolutionScale = 0.6;
    }

    this.quality.bgCullRadius = this.rung >= 4 ? 140 : 250;
    this.quality.survivalMode = this.rung >= 5;

    // Compensation uniforms
    const s = this.quality.resolutionScale;
    this.quality.compensationUniforms.dotPitch = 1.0 / s;
    this.quality.compensationUniforms.hatchStep = 1.0 / s;
  }
}

export const perfMonitor = new AdaptivePerformanceMonitor();
