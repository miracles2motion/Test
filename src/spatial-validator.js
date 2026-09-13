/**
 * Doodle Strike - Spatial JSON Validator & Repairer
 * 
 * Takes the raw JSON output from the LLM, validates it against the schema,
 * and automatically heals tactical or structural mistakes (e.g. exposed spawns, dead ends).
 */

export class SpatialValidator {
  
  validateAndRepair(spatialJSON) {
    const errors = [];
    const warnings = [];
    let repaired;
    
    try {
      repaired = JSON.parse(JSON.stringify(spatialJSON)); // deep clone
    } catch (e) {
      return { valid: false, errors: ['Failed to parse JSON string'], warnings: [], repairCount: 0 };
    }

    if (!repaired.regions) repaired.regions = [];
    if (!repaired.connections) repaired.connections = [];
    if (!repaired.gameplayElements) repaired.gameplayElements = { spawns: [], grapplePoints: [], coverNodes: [] };

    // --- Structural Validation ---
    if (repaired.regions.length < 2) {
      errors.push('Map must have at least 2 regions');
    }

    // --- Connectivity Validation ---
    // Make sure every region is connected to something
    const connectionGraph = {};
    repaired.regions.forEach(r => connectionGraph[r.id] = 0);
    
    repaired.connections.forEach(c => {
      if (connectionGraph[c.from] !== undefined) connectionGraph[c.from]++;
      if (connectionGraph[c.to] !== undefined) connectionGraph[c.to]++;
    });

    for (const [regionId, connections] of Object.entries(connectionGraph)) {
      if (connections === 0) {
        warnings.push(`Region '${regionId}' is a dead end. Adding emergency connection.`);
        // Just link it to the first available region
        const target = repaired.regions.find(r => r.id !== regionId);
        if (target) {
          repaired.connections.push({
            from: regionId,
            to: target.id,
            type: 'open',
            width: 5,
            height: 5,
            bidirectional: true
          });
        }
      }
    }

    // --- Spawn Safety Validation ---
    if (repaired.gameplayElements.spawns) {
      for (const spawn of repaired.gameplayElements.spawns) {
        if (spawn.protection === 'exposed') {
          warnings.push(`Spawn at [${spawn.position}] is exposed. Upgrading to 'partial' protection.`);
          spawn.protection = 'partial';
        }
      }
    }

    // --- Grapple Chain Validation ---
    if (repaired.gameplayElements.grapplePoints && repaired.gameplayElements.grapplePoints.length > 0) {
      const grapples = repaired.gameplayElements.grapplePoints;
      for (let i = 0; i < grapples.length; i++) {
        let hasNeighbor = false;
        for (let j = 0; j < grapples.length; j++) {
          if (i === j) continue;
          const dist = this.getDistance(grapples[i].position, grapples[j].position);
          if (dist <= 18.0) {
            hasNeighbor = true;
            break;
          }
        }
        if (!hasNeighbor && grapples.length > 1) {
          warnings.push(`Grapple point at [${grapples[i].position}] is isolated (>18m from nearest). Auto-shifting it closer.`);
          // Simple heal: move it halfway towards the closest one
          const nearest = this.getNearestPoint(grapples[i].position, grapples.filter((_, idx) => idx !== i));
          if (nearest) {
            grapples[i].position = [
              (grapples[i].position[0] + nearest[0]) / 2,
              (grapples[i].position[1] + nearest[1]) / 2,
              (grapples[i].position[2] + nearest[2]) / 2
            ];
          }
        }
      }
    }

    return {
      valid: errors.length === 0,
      repaired,
      errors,
      warnings,
      repairCount: warnings.length,
    };
  }

  getDistance(p1, p2) {
    return Math.sqrt(Math.pow(p1[0] - p2[0], 2) + Math.pow(p1[1] - p2[1], 2) + Math.pow(p1[2] - p2[2], 2));
  }

  getNearestPoint(target, pointsList) {
    let nearest = null;
    let minDist = Infinity;
    for (const point of pointsList) {
      const dist = this.getDistance(target, point.position);
      if (dist < minDist) {
        minDist = dist;
        nearest = point.position;
      }
    }
    return nearest;
  }
}
