// ============================================================================
// DREAM PHASE 7 - CONTENT-ADDRESSED GEOMETRY CACHE (SYSTEM 2)
// Caches procedural archetypes by deterministic parameter hash
// ============================================================================

function hashString(str) {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return (hash >>> 0).toString(16);
}

export class GeometryCache {
  constructor(memoryBudgetMB = 200) {
    this.entries = new Map(); // key -> cache entry
    this.memoryBudgetMB = memoryBudgetMB;
    this.memoryUsedMB = 0;
    this.lru = [];
  }

  key(grammarId, species, params = {}, biomeId = 'default', penProfileId = 'default', lodLevel = 0) {
    const raw = `${grammarId}:${species}:${params.iterations ?? 0}:${params.seed ?? 0}:${params.curvature ?? 0}:${params.branchAngle ?? 0}:${params.leafDensity ?? 0}:${biomeId}:${penProfileId}:${lodLevel}`;
    return hashString(raw);
  }

  has(cacheKey) {
    return this.entries.has(cacheKey);
  }

  get(cacheKey) {
    const hit = this.entries.get(cacheKey);
    if (hit) {
      this.touch(cacheKey);
      return hit;
    }
    return null;
  }

  acquire(cacheKey, buildFn, triangleEstimate = 1000) {
    const hit = this.entries.get(cacheKey);
    if (hit) {
      this.touch(cacheKey);
      return hit;
    }

    const entry = buildFn();
    const memoryMB = entry.memoryMB || (triangleEstimate * 36) / (1024 * 1024); // approx byte footprint
    entry.memoryMB = memoryMB;
    entry.cacheKey = cacheKey;

    this.entries.set(cacheKey, entry);
    this.memoryUsedMB += memoryMB;
    this.touch(cacheKey);

    return entry;
  }

  touch(cacheKey) {
    const idx = this.lru.indexOf(cacheKey);
    if (idx !== -1) {
      this.lru.splice(idx, 1);
    }
    this.lru.push(cacheKey);
  }

  clear() {
    for (const entry of this.entries.values()) {
      if (entry.geometry && entry.geometry.dispose) entry.geometry.dispose();
      if (entry.material && entry.material.dispose) entry.material.dispose();
    }
    this.entries.clear();
    this.lru.length = 0;
    this.memoryUsedMB = 0;
  }
}

export const geometryCache = new GeometryCache();
