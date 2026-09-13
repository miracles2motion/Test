// ============================================================================
// DREAM PHASE 7 - LOD MANAGER (SYSTEM 3)
// Screen-space error thresholds, hysteresis, and amortized swaps (max 3/frame)
// ============================================================================

export class LODManager {
  constructor() {
    this.registeredObjects = []; // { lod0, lod1, lod2, pos, radius, importance, currentLOD, hysteresis }
    this.swapQueue = [];         // pending swaps [ { obj, targetLOD } ]
    this.viewportH = 800;
    this.fovY = 70 * (Math.PI / 180);
    this.h01 = 120; // LOD0 -> LOD1 pixel threshold
    this.h12 = 36;  // LOD1 -> LOD2 pixel threshold
  }

  setViewport(height, fovDeg = 70) {
    this.viewportH = height;
    this.fovY = fovDeg * (Math.PI / 180);
  }

  register(obj) {
    // obj = { lod0, lod1, lod2, pos: [x,y,z], radius, importance }
    const record = {
      lod0: obj.lod0,
      lod1: obj.lod1,
      lod2: obj.lod2,
      pos: obj.pos,
      radius: obj.radius || 2.0,
      importance: obj.importance || 1.0,
      currentLOD: 0,
      targetLOD: 0,
    };
    this.applyLODVisibility(record, 0);
    this.registeredObjects.push(record);
    return record;
  }

  applyLODVisibility(record, lod) {
    record.currentLOD = lod;
    if (record.lod0) record.lod0.visible = lod === 0;
    if (record.lod1) record.lod1.visible = lod === 1;
    if (record.lod2) record.lod2.visible = lod === 2;
  }

  // Evaluated once every few frames or per camera movement
  update(cameraPos) {
    const factor = this.viewportH / (2 * Math.tan(this.fovY / 2));
    const cx = cameraPos.x;
    const cy = cameraPos.y;
    const cz = cameraPos.z;

    for (let i = 0; i < this.registeredObjects.length; i++) {
      const obj = this.registeredObjects[i];
      const dx = obj.pos[0] - cx;
      const dy = obj.pos[1] - cy;
      const dz = obj.pos[2] - cz;
      const distSq = dx * dx + dy * dy + dz * dz;
      const dist = Math.sqrt(Math.max(0.1, distSq));

      // Projected pixel height
      const projHeight = ((2 * obj.radius) / dist) * factor * obj.importance;

      // Hysteresis calculation (20% threshold delta)
      let desired = 0;
      if (obj.currentLOD === 0) {
        if (projHeight < this.h01) desired = 1;
      } else if (obj.currentLOD === 1) {
        if (projHeight < this.h12) desired = 2;
        else if (projHeight > this.h01 * 1.20) desired = 0;
        else desired = 1;
      } else if (obj.currentLOD === 2) {
        if (projHeight > this.h12 * 1.20) desired = 1;
        else desired = 2;
      }

      if (desired !== obj.currentLOD && desired !== obj.targetLOD) {
        obj.targetLOD = desired;
        this.swapQueue.push({ obj, targetLOD: desired, priority: Math.abs(projHeight - this.h01) });
      }
    }

    // Sort queue by priority descending (largest visual delta first)
    if (this.swapQueue.length > 1) {
      this.swapQueue.sort((a, b) => b.priority - a.priority);
    }
  }

  // AMORTIZED SWAPS: Flush at most 3 swaps per frame (Zero Hitch Rule)
  flush(maxSwaps = 3) {
    let executed = 0;
    while (this.swapQueue.length > 0 && executed < maxSwaps) {
      const item = this.swapQueue.shift();
      this.applyLODVisibility(item.obj, item.targetLOD);
      executed++;
    }
  }

  clear() {
    this.registeredObjects.length = 0;
    this.swapQueue.length = 0;
  }
}

export const lodManager = new LODManager();
