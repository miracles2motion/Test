/**
 * Doodle Strike - Rhythm Placer
 * 
 * Procedurally places detail geometry (crates, barrels, half-walls) along combat lanes
 * based on the natural rhythm of player engagement (shoot, move, shoot) rather than
 * random noise scattering.
 */

export class RhythmPlacer {
  
  constructor() {
    this.engagementDuration = 2.5; 
    this.repositionDuration = 1.8;
    // Base player speed is ~7.5m/s. Rhythm wavelength is ~32m
    this.rhythmWavelength = (this.engagementDuration + this.repositionDuration) * 7.5;
  }

  /**
   * Generates cover placements along a given path (lane)
   * @param {Array} lane Array of {x, y, z} waypoints
   */
  placeAlongLane(lane) {
    const placements = [];
    let distanceAccumulator = 0;
    const halfWavelength = this.rhythmWavelength / 2;

    for (let i = 1; i < lane.length; i++) {
      const p1 = lane[i - 1];
      const p2 = lane[i];
      
      const dx = p2.x - p1.x;
      const dy = p2.y - p1.y;
      const dz = p2.z - p1.z;
      const segmentLength = Math.hypot(dx, dy, dz);
      
      distanceAccumulator += segmentLength;

      // Full wavelength: Hard Cover (Full body protection)
      if (distanceAccumulator >= this.rhythmWavelength) {
        placements.push({
          position: { ...p2 },
          type: 'HARD_COVER',
          purpose: 'Primary cover node for sustained engagement'
        });
        distanceAccumulator = 0;
      }
      // Half wavelength: Soft Cover (Waist high protection)
      else if (distanceAccumulator >= halfWavelength) {
        // Only place if we haven't just placed hard cover nearby
        const isNear = placements.some(p => Math.hypot(p.position.x - p2.x, p.position.z - p2.z) < halfWavelength * 0.3);
        if (!isNear) {
          placements.push({
            position: { ...p2 },
            type: 'SOFT_COVER',
            purpose: 'Transitional cover for repositioning'
          });
          // Don't reset accumulator here, we still want hard cover at full wavelength
        }
      }
    }

    // Apply anti-symmetry shift (staggering cover side-to-side)
    for (let j = 0; j < placements.length; j++) {
      if (j % 2 === 1) {
        // Shift perpendicular to lane direction (simplified)
        const offset = (Math.random() * 2 + 1) * (Math.random() < 0.5 ? 1 : -1);
        // For simplicity we just shift X or Z depending on which axis seems less dominant,
        // but adding random scatter is a decent approximation of non-linear lanes.
        if (Math.random() > 0.5) {
          placements[j].position.x += offset;
        } else {
          placements[j].position.z += offset;
        }
      }
    }

    return placements;
  }
}
