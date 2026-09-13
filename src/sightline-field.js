/**
 * Doodle Strike - Sightline Tensor Field
 * 
 * Computes a continuous 3D field across the map encoding how visible every point is,
 * from what directions, and at what ranges.
 */

export class SightlineTensorField {
  constructor(bounds, resolution = 4.0) {
    // resolution = 4m means one sample every 4 meters
    this.resolution = resolution;
    this.grid = [];
    
    // Initialize grid points
    for (let x = bounds.minX; x <= bounds.maxX; x += resolution) {
      for (let z = bounds.minZ; z <= bounds.maxZ; z += resolution) {
        // We evaluate primarily at Y = 1.0 (waist height) for ground cover
        // and Y = 8.0 for sniper perches, but to save compute we just do Y=1.6 (eye level)
        this.grid.push({
          x, y: 1.6, z,
          tensor: {
            exposureScore: 0,
            longRangeExposure: 0,
            shortRangeExposure: 0
          }
        });
      }
    }
  }

  compute(colliders) {
    // Generate a stratified radial pattern for raycasting (e.g. 16 rays around the compass)
    const rays = [];
    const numRays = 16;
    for (let i = 0; i < numRays; i++) {
      const angle = (i / numRays) * Math.PI * 2;
      rays.push({ dx: Math.cos(angle), dz: Math.sin(angle) });
    }
    
    for (const cell of this.grid) {
      let hits = 0;
      let longHits = 0;
      let shortHits = 0;
      
      for (const ray of rays) {
        // Simple 2D raycast for performance in Node.js
        let blocked = false;
        let dist = 0;
        
        for (let step = 2; step <= 40; step += 2) {
          const tx = cell.x + ray.dx * step;
          const ty = cell.y;
          const tz = cell.z + ray.dz * step;
          
          for (const col of colliders) {
            if (col.opts && col.opts.noShoot) continue;
            // AABB check
            if (tx >= col.min.x && tx <= col.max.x && ty >= col.min.y && ty <= col.max.y && tz >= col.min.z && tz <= col.max.z) {
              blocked = true;
              dist = step;
              break;
            }
          }
          if (blocked) break;
        }
        
        if (!blocked) {
          // Open air all the way to 40m
          hits++;
          longHits++;
        } else {
          // Ray hit something
          if (dist > 30) {
            hits++;
            longHits++;
          } else if (dist < 10) {
            // Hit cover very close
          } else {
            hits++;
          }
        }
      }
      
      cell.tensor.exposureScore = hits / numRays;
      cell.tensor.longRangeExposure = longHits / numRays;
      cell.tensor.shortRangeExposure = shortHits / numRays;
    }
  }

  /**
   * Evaluates how 'campable' a point is.
   * High long range exposure + Low short range exposure = Sniper Perch (Good for Snipers, Bad for Rushers)
   * High all-around exposure = Death Trap
   */
  getExposureAt(x, z) {
    // Find nearest cell
    let nearest = this.grid[0];
    let minDist = Infinity;
    
    for (const cell of this.grid) {
      const dist = Math.hypot(cell.x - x, cell.z - z);
      if (dist < minDist) {
        minDist = dist;
        nearest = cell;
      }
    }
    
    return nearest.tensor;
  }
}
