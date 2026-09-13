/**
 * Doodle Strike - Hybrid Detailing Standard (UDS v2)
 * Bridges the gap between Rigid geometry (boxes) and Organic geometry (curves/trees)
 * to ensure realistic connections.
 */

export class HybridDetailingStandard {
  constructor() {
    this.organicODS = new OrganicDetailingStandard();
  }

  getStandardForGeometry(geometryType) {
    if (geometryType === 'HYBRID') return this;
    if (geometryType === 'ORGANIC') return this.organicODS;
    return 'RIGID_UDS'; // existing UDS
  }

  validateJunction(rigidElement, organicElement) {
    const violations = [];
    
    // Rule 1: Curvature Warping
    // If bolting a flat metal platform to a curved tree trunk, the platform needs to bend.
    const isCurved = organicElement.geometry === 'lsystem_vine' || organicElement.geometry === 'cylinder';
    const isFlat = rigidElement.geometry === 'box';
    
    if (isCurved && isFlat) {
      violations.push({
        type: 'JUNCTION_MISMATCH',
        severity: 'VISUAL',
        fix: `Warp rigid element '${rigidElement.role}' to match organic curvature`
      });
    }
    
    // Rule 2: Attachment Hardware
    // Must have visible brackets/straps
    if (!rigidElement.hasVisibleBrackets) {
      violations.push({
        type: 'MISSING_ATTACHMENT_DETAIL',
        severity: 'DETAILING',
        fix: `Add visible bracket/strap/bolt detailing to '${rigidElement.role}'`
      });
    }
    
    return violations;
  }
}

class OrganicDetailingStandard {
  constructor() {
    this.tiers = {
      0: { name: 'Ground Cover', maxComplexity: 50 },
      1: { name: 'Undergrowth', maxComplexity: 200 },
      2: { name: 'Mid-Growth', maxComplexity: 800, triad: 'Core-Body-Surface' },
      3: { name: 'Canopy', maxComplexity: 3000, triad: 'Core-Body-Surface' },
      4: { name: 'Hero Organism', maxComplexity: 10000, triad: 'Core-Body-Surface' }
    };
  }

  validateOrganicGeometry(geometryElements) {
    const violations = [];
    
    // Ensure trees are grounded
    for (const el of geometryElements) {
      if (el.role === 'mast' || el.role === 'pier') {
        if (!el.isGrounded) {
          violations.push({
            type: 'FLOATING_ORGANIC',
            severity: 'CRITICAL',
            element: el.role,
            fix: 'Extend root system to nearest ground surface'
          });
        }
      }
    }
    
    return violations;
  }
}
