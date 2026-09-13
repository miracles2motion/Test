/**
 * Doodle Strike - Component Grammar
 * Defines the atomic building blocks and assembly recipes for the Prefab Synthesizer.
 * Extremely flexible: can build bridges, galleons, giant pencils, cyber-towers, etc.
 */

export class ComponentGrammar {
  constructor() {
    // Atomic components: The smallest indivisible building blocks
    this.atomics = {
      // --- Structural ---
      'pillar': { geometry: 'cylinder', tags: ['structural', 'vertical', 'load-bearing'] },
      'beam': { geometry: 'box', tags: ['structural', 'horizontal', 'load-bearing'] },
      'arch': { geometry: 'spline_extrusion', tags: ['structural', 'spanning', 'decorative'] },
      'platform': { geometry: 'box', tags: ['surface', 'walkable', 'horizontal'] },
      'wedge_ramp': { geometry: 'wedge', tags: ['transit', 'sloped', 'walkable'] },
      
      // --- Organic/Abstract ---
      'vine_cluster': { geometry: 'lsystem_vine', tags: ['organic', 'decorative', 'climbable'] },
      'hull_curve': { geometry: 'spline_extrusion', tags: ['structural', 'curved', 'boundary'] },
      'sphere_joint': { geometry: 'sphere', tags: ['structural', 'connector', 'decorative'] },
      
      // --- Functional / Gameplay ---
      'staircase_segment': { geometry: 'stair_primitive', tags: ['transit', 'vertical', 'walkable'] },
      'grapple_anchor': { geometry: 'ring', tags: ['gameplay', 'grapple', 'vertical-transit'] },
      'barrel_cover': { geometry: 'barrel', tags: ['gameplay', 'cover', 'destructible'] },
      'banner': { geometry: 'spline_extrusion', tags: ['decorative', 'hanging', 'visual-only'] }
    };

    // Connection rules: what can logically attach to what
    this.connectionRules = {
      'flat-flat': { allowed: true, alignment: 'flush' },
      'flat-surface': { allowed: true, alignment: 'centered' },
      'surface-grapple': { allowed: true, alignment: 'ceiling-or-wall' },
      'hook-hanging': { allowed: true, alignment: 'suspended' }
    };
  }

  // --- ASSEMBLY RECIPES ---
  // High-level patterns that combine atomics.
  getAssemblyPatterns() {
    return {
      'bridge': {
        description: 'A walkable span between two points',
        template: [
          { component: 'platform', role: 'deck', layout: 'span_between_points' },
          { component: 'beam', role: 'support_rails', layout: 'parallel_to_deck' },
          { component: 'pillar', role: 'pier', layout: 'spaced_interval', spacing: 8 }
        ]
      },
      
      'tower': {
        description: 'A vertical structure with observation levels',
        template: [
          { component: 'pillar', role: 'core', layout: 'square_corners' },
          { component: 'platform', role: 'floor', layout: 'stacked_vertical', spacing: 4 },
          { component: 'staircase_segment', role: 'access', layout: 'spiral_or_switchback' }
        ]
      },
      
      'ship_hull': {
        description: 'A massive curved boat/ship structure',
        template: [
          { component: 'hull_curve', role: 'hull_base', layout: 'u_shape_extrusion' },
          { component: 'wedge_ramp', role: 'bow', layout: 'front_slope' },
          { component: 'platform', role: 'deck', layout: 'cap_top' },
          { component: 'pillar', role: 'mast', layout: 'centerline_vertical', count: '1-3' },
          { component: 'barrel_cover', role: 'cargo', layout: 'scatter_on_deck' }
        ]
      },

      'giant_pencil': {
        description: 'Classroom scale map prop',
        template: [
          { component: 'pillar', role: 'shaft', layout: 'hexagonal_extrusion' },
          { component: 'wedge_ramp', role: 'tip', layout: 'cone_point' },
          { component: 'sphere_joint', role: 'eraser', layout: 'cap_back' }
        ]
      }
    };
  }
}
