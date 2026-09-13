/**
 * Doodle Strike - Movement Physics Model
 * 
 * Simulates real bot traversal physics (momentum, arcs, fall damage)
 * instead of simple straight-line A* pathfinding.
 */

export class MovementPhysicsModel {
  constructor() {
    this.gravity = -9.81 * 2.2;    // Tuned for feel
    this.maxRunSpeed = 7.5;        // m/s
    this.maxSprintSpeed = 10.0;    // m/s
    this.jumpVelocity = 8.0;       // m/s upward
    this.airControl = 0.3;         // fraction of ground control
    this.grappleSpeed = 18.0;      // m/s
    this.grappleMaxRange = 18.0;   // meters
    this.fallDamageThreshold = 12.0; // meters of free fall before damage
  }

  /**
   * Simulates traversal across a path using physics.
   * For simplicity in Phase 2, this calculates idealized segment times,
   * checks for vertical viability (fall damage), and estimates momentum carryover.
   */
  simulateTraversal(path, colliders, grapplePoints, botArchetype) {
    let totalTime = 0;
    let fallDamageEvents = 0;
    let grappleSwings = 0;
    let momentumScore = 100;
    
    const speed = this.maxRunSpeed * botArchetype.movementSpeed;

    for (let i = 0; i < path.length - 1; i++) {
      const from = path[i];
      const to = path[i + 1];
      
      const dx = to.x - from.x;
      const dy = to.y - from.y;
      const dz = to.z - from.z;
      const distance = Math.hypot(dx, dy, dz);
      
      let segmentTime = distance / speed;
      
      // Vertical check
      if (dy < -this.fallDamageThreshold) {
        fallDamageEvents++;
        momentumScore -= 10; // hard landing breaks momentum
        segmentTime += 1.5; // recovery animation
      }
      
      // Grapple check
      if (dy > 3.0) {
        // Need to go up. Is there a grapple point?
        const nearbyGrapples = grapplePoints.filter(g => Math.hypot(g.x - to.x, g.y - to.y, g.z - to.z) < this.grappleMaxRange);
        
        if (nearbyGrapples.length > 0 && Math.random() < botArchetype.grappleUsageRate) {
          grappleSwings++;
          segmentTime = distance / this.grappleSpeed;
          momentumScore += 2; // grappling preserves/builds momentum
        } else {
          // Normal jump or stairs
          segmentTime = distance / (speed * 0.7); // slower going up
          momentumScore -= 2;
        }
      }
      
      totalTime += segmentTime;
    }
    
    // Normalize momentum score
    momentumScore = Math.max(0, Math.min(100, momentumScore));
    
    const totalDistance = path.length > 1 ? path.slice(1).reduce((acc, p, i) => {
      const prev = path[i];
      return acc + Math.hypot(p.x - prev.x, p.y - prev.y, p.z - prev.z);
    }, 0) : 0;

    return {
      totalTime,
      averageSpeed: totalTime > 0 ? totalDistance / totalTime : 0,
      fallDamageEvents,
      grappleSwings,
      momentumCarryScore: momentumScore
    };
  }
}
