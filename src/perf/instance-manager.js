// ============================================================================
// DREAM PHASE 7 - CELL-BATCHED INSTANCE MANAGER (SYSTEM 2)
// Batches instanced meshes into 40m spatial cells to preserve frustum culling
// ============================================================================

import * as THREE from 'three';

export const SPATIAL_CELL_SIZE = 40.0; // 40m XZ grid

export class InstanceBatch {
  constructor(geometry, material, capacity = 64) {
    this.geometry = geometry;
    this.material = material;
    this.capacity = capacity;
    this.mesh = new THREE.InstancedMesh(geometry, material, capacity);
    this.mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this.mesh.frustumCulled = true;
    this.count = 0;

    this._m = new THREE.Matrix4();
    this._p = new THREE.Vector3();
    this._q = new THREE.Quaternion();
    this._s = new THREE.Vector3();
    this._color = new THREE.Color();
  }

  add(pos, rotY = 0, scale = [1, 1, 1], tint = null) {
    if (this.count >= this.capacity) {
      this.growCapacity();
    }

    this._p.set(pos[0], pos[1], pos[2]);
    this._q.setFromAxisAngle(new THREE.Vector3(0, 1, 0), rotY);
    this._s.set(scale[0] || 1, scale[1] || 1, scale[2] || 1);

    this._m.compose(this._p, this._q, this._s);
    this.mesh.setMatrixAt(this.count, this._m);

    if (tint && this.mesh.setColorAt) {
      this._color.setRGB(tint[0], tint[1], tint[2]);
      this.mesh.setColorAt(this.count, this._color);
      if (this.mesh.instanceColor) this.mesh.instanceColor.needsUpdate = true;
    }

    this.count++;
    this.mesh.count = this.count;
    this.mesh.instanceMatrix.needsUpdate = true;
    return this.count - 1;
  }

  growCapacity() {
    const newCap = Math.max(16, Math.floor(this.capacity * 1.5));
    const newMesh = new THREE.InstancedMesh(this.geometry, this.material, newCap);
    newMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    newMesh.frustumCulled = true;

    for (let i = 0; i < this.count; i++) {
      this.mesh.getMatrixAt(i, this._m);
      newMesh.setMatrixAt(i, this._m);
      if (this.mesh.getColorAt && newMesh.setColorAt) {
        this.mesh.getColorAt(i, this._color);
        newMesh.setColorAt(i, this._color);
      }
    }

    newMesh.count = this.count;
    newMesh.instanceMatrix.needsUpdate = true;
    if (newMesh.instanceColor) newMesh.instanceColor.needsUpdate = true;

    if (this.mesh.parent) {
      const parent = this.mesh.parent;
      parent.remove(this.mesh);
      parent.add(newMesh);
    }

    this.mesh.dispose();
    this.mesh = newMesh;
    this.capacity = newCap;
  }
}

export class InstanceManager {
  constructor() {
    this.cells = new Map(); // "cellX:cellZ" -> Map(archetypeKey -> InstanceBatch)
    this.rootGroup = new THREE.Group();
    this.rootGroup.name = 'InstanceRoot';
  }

  cellKey(x, z) {
    const cx = Math.floor(x / SPATIAL_CELL_SIZE);
    const cz = Math.floor(z / SPATIAL_CELL_SIZE);
    return `${cx}:${cz}`;
  }

  addInstance(archetypeKey, geometry, material, pos, rotY = 0, scale = [1, 1, 1], tint = null) {
    const ck = this.cellKey(pos[0], pos[2]);
    let cellMap = this.cells.get(ck);
    if (!cellMap) {
      cellMap = new Map();
      this.cells.set(ck, cellMap);
    }

    let batch = cellMap.get(archetypeKey);
    if (!batch) {
      batch = new InstanceBatch(geometry, material, 32);
      cellMap.set(archetypeKey, batch);
      this.rootGroup.add(batch.mesh);
    }

    return batch.add(pos, rotY, scale, tint);
  }

  clear() {
    for (const cellMap of this.cells.values()) {
      for (const batch of cellMap.values()) {
        if (batch.mesh.parent) batch.mesh.parent.remove(batch.mesh);
        batch.mesh.dispose();
      }
    }
    this.cells.clear();
  }
}

export const instanceManager = new InstanceManager();
