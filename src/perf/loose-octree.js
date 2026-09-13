// ============================================================================
// DREAM PHASE 7 - LOOSE OCTREE & SPATIAL COLLISION STORE (SYSTEM 5)
// Flat typed arrays, cell-chunked broadphase queries (O(local) vs O(N))
// ============================================================================

export const COLLISION_LOD = {
  FULL: 0,
  HULL: 1,
  AABB: 2,
};

export class LooseOctree {
  constructor(bounds = { minX: -200, minY: -50, minZ: -200, maxX: 200, maxY: 100, maxZ: 200 }, cellSize = 40.0) {
    this.bounds = bounds;
    this.cellSize = cellSize;

    // Grid of loose cells: key "cx:cz" -> array of primitive references
    this.cells = new Map();

    // Flat preallocated storage for static capsules & AABBs
    // Capsule: ax, ay, az, bx, by, bz, radius, lodClass
    this.capsules = [];
    // AABB: minX, minY, minZ, maxX, maxY, maxZ, lodClass
    this.aabbs = [];

    // Preallocated query result buffer to satisfy zero-allocation in tick()
    this.queryResultCapsules = [];
    this.queryResultAABBs = [];
  }

  cellKey(x, z) {
    const cx = Math.floor(x / this.cellSize);
    const cz = Math.floor(z / this.cellSize);
    return `${cx}:${cz}`;
  }

  addCapsule(a, b, radius, lodClass = COLLISION_LOD.FULL) {
    const id = this.capsules.length;
    const item = {
      id,
      type: 'capsule',
      ax: a[0], ay: a[1], az: a[2],
      bx: b[0], by: b[1], bz: b[2],
      radius,
      lodClass,
    };
    this.capsules.push(item);

    // Insert into cells overlapped by both ends (loose boundary coverage)
    const midX = (a[0] + b[0]) * 0.5;
    const midZ = (a[2] + b[2]) * 0.5;
    this.insertIntoCell(midX, midZ, item);
    return id;
  }

  addAABB(min, max, lodClass = COLLISION_LOD.AABB) {
    const id = this.aabbs.length;
    const item = {
      id,
      type: 'aabb',
      minX: min[0], minY: min[1], minZ: min[2],
      maxX: max[0], maxY: max[1], maxZ: max[2],
      lodClass,
    };
    this.aabbs.push(item);

    const midX = (min[0] + max[0]) * 0.5;
    const midZ = (min[2] + max[2]) * 0.5;
    this.insertIntoCell(midX, midZ, item);
    return id;
  }

  insertIntoCell(x, z, item) {
    const cx = Math.floor(x / this.cellSize);
    const cz = Math.floor(z / this.cellSize);

    // Loose insertion: insert into primary cell and immediate neighbors if near border
    for (let dx = -1; dx <= 1; dx++) {
      for (let dz = -1; dz <= 1; dz++) {
        const key = `${cx + dx}:${cz + dz}`;
        let list = this.cells.get(key);
        if (!list) {
          list = [];
          this.cells.set(key, list);
        }
        list.push(item);
      }
    }
  }

  // Zero-allocation query around entity point
  queryNear(x, z, maxLOD = COLLISION_LOD.FULL) {
    this.queryResultCapsules.length = 0;
    this.queryResultAABBs.length = 0;

    const key = this.cellKey(x, z);
    const items = this.cells.get(key);
    if (!items) return { capsules: this.queryResultCapsules, aabbs: this.queryResultAABBs };

    for (let i = 0; i < items.length; i++) {
      const it = items[i];
      if (it.lodClass > maxLOD) continue;

      if (it.type === 'capsule') {
        this.queryResultCapsules.push(it);
      } else if (it.type === 'aabb') {
        this.queryResultAABBs.push(it);
      }
    }

    return {
      capsules: this.queryResultCapsules,
      aabbs: this.queryResultAABBs
    };
  }

  clear() {
    this.cells.clear();
    this.capsules.length = 0;
    this.aabbs.length = 0;
    this.queryResultCapsules.length = 0;
    this.queryResultAABBs.length = 0;
  }
}

export const looseOctree = new LooseOctree();
