/**
 * Doodle Strike - Voxel Terrain Engine
 * Uses SDFs to generate terrain, then extracts TOPOGRAPHIC CONTOUR LINES instead of 
 * polygons, ensuring perfect compatibility with the ballpoint-pen renderer.
 */

export class VoxelTerrainEngine {
  constructor(bounds, resolution = 1.0) {
    this.bounds = bounds;
    this.resolution = resolution;
    this.grid = {
      x: Math.ceil((bounds.maxX - bounds.minX) / resolution),
      y: Math.ceil((bounds.maxY - bounds.minY) / resolution),
      z: Math.ceil((bounds.maxZ - bounds.minZ) / resolution)
    };
    // 1D array representing 3D voxel grid. Values > 0 are air, < 0 are solid.
    this.voxels = new Float32Array(this.grid.x * this.grid.y * this.grid.z);
    this.voxels.fill(1.0); // start with all air
  }

  getIndex(ix, iy, iz) {
    return ix + (iy * this.grid.x) + (iz * this.grid.x * this.grid.y);
  }

  getWorldPos(ix, iy, iz) {
    return [
      this.bounds.minX + ix * this.resolution,
      this.bounds.minY + iy * this.resolution,
      this.bounds.minZ + iz * this.resolution
    ];
  }

  // SDF: Add a gaussian hill (solid)
  addHill(center, radius, height) {
    for (let ix = 0; ix < this.grid.x; ix++) {
      for (let iy = 0; iy < this.grid.y; iy++) {
        for (let iz = 0; iz < this.grid.z; iz++) {
          const worldPos = this.getWorldPos(ix, iy, iz);
          const dx = worldPos[0] - center[0];
          const dz = worldPos[2] - center[2];
          const distSq = dx*dx + dz*dz;
          
          if (distSq < (radius * radius * 4)) { // optimization bounding cylinder
            // The SDF height surface
            const surfaceY = center[1] + height * Math.exp(-distSq / (2 * radius * radius));
            // Distance from current point to surface
            const sdf = worldPos[1] - surfaceY;
            
            const idx = this.getIndex(ix, iy, iz);
            this.voxels[idx] = Math.min(this.voxels[idx], sdf);
          }
        }
      }
    }
  }

  // SDF: Carve a spherical cave (air)
  carveCave(center, radius) {
    for (let ix = 0; ix < this.grid.x; ix++) {
      for (let iy = 0; iy < this.grid.y; iy++) {
        for (let iz = 0; iz < this.grid.z; iz++) {
          const worldPos = this.getWorldPos(ix, iy, iz);
          const dx = worldPos[0] - center[0];
          const dy = worldPos[1] - center[1];
          const dz = worldPos[2] - center[2];
          const dist = Math.sqrt(dx*dx + dy*dy + dz*dz);
          
          if (dist < radius * 1.5) {
            const sdf = dist - radius; // negative inside cave, positive outside
            // We want to carve air, so we MAX the current value with -sdf
            // If current is -5 (solid ground), and we are inside cave (-sdf is +3), result is +3 (air)
            const idx = this.getIndex(ix, iy, iz);
            this.voxels[idx] = Math.max(this.voxels[idx], -sdf);
          }
        }
      }
    }
  }

  // --- TOPOGRAPHIC EXTRACTION ---
  // A computationally cheap alternative to full marching cubes:
  // Instead of extracting 3D triangles, we just slice the voxel grid horizontally
  // at intervals and find the 2D contour lines (0-crossings).
  // Perfect for the pen renderer.
  
  extractTopographicContours(contourInterval = 1.0) {
    const contours = [];
    
    // For each horizontal slice (Y axis)
    for (let iy = 0; iy < this.grid.y; iy++) {
      const elevation = this.bounds.minY + iy * this.resolution;
      
      // Only extract at the specified interval
      if (Math.abs(elevation % contourInterval) > 0.1) continue;
      
      const lines = [];
      
      // 2D Marching Squares on this slice
      for (let ix = 0; ix < this.grid.x - 1; ix++) {
        for (let iz = 0; iz < this.grid.z - 1; iz++) {
          const v00 = this.voxels[this.getIndex(ix, iy, iz)];
          const v10 = this.voxels[this.getIndex(ix+1, iy, iz)];
          const v01 = this.voxels[this.getIndex(ix, iy, iz+1)];
          const v11 = this.voxels[this.getIndex(ix+1, iy, iz+1)];
          
          // Determine 4-bit state
          let state = 0;
          if (v00 <= 0) state |= 1; // bottom-left
          if (v10 <= 0) state |= 2; // bottom-right
          if (v11 <= 0) state |= 4; // top-right
          if (v01 <= 0) state |= 8; // top-left
          
          if (state > 0 && state < 15) {
            // There is a contour line passing through this square!
            // We just store the cell center for a rough outline (could interpolate for smoothness)
            const cx = this.bounds.minX + (ix + 0.5) * this.resolution;
            const cz = this.bounds.minZ + (iz + 0.5) * this.resolution;
            lines.push([cx, elevation, cz]);
          }
        }
      }
      
      if (lines.length > 0) {
        // Determine pen thickness based on elevation
        // Major contours (every 5m) get thicker lines
        let weight = 0.5;
        if (Math.abs(elevation % (contourInterval * 5)) < 0.1) weight = 2.0;
        else if (Math.abs(elevation % (contourInterval * 2)) < 0.1) weight = 1.0;
        
        contours.push({ elevation, lines, weight });
      }
    }
    
    return contours;
  }
}
