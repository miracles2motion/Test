/**
 * Doodle Strike - Enemy Pen Stylizer
 * Applies biome-appropriate pen rendering treatments (wobble, hatching) to enemies.
 */

export class EnemyPenStylizer {
  
  stylizeEnemy(enemyAnatomy, biome) {
    const style = {
      outline: { weight: 1.5, wobble: 0 },
      interior: { hatching: 'none', crossHatch: false },
      glow: null,
      motionLines: false,
    };
    
    switch (biome) {
      case 'alien_jungle':
        style.outline.wobble = 0.08; // wobbly organic lines
        style.outline.weight = 1.2;
        style.interior.hatching = 'organic';
        if (enemyAnatomy.aura === 'bioluminescent_glow') {
          style.glow = { type: 'double-stroke', innerWeight: 0.3, outerWeight: 1.5 };
        }
        break;
        
      case 'gothic_cathedral':
        style.outline.wobble = 0.01; // nearly straight lines
        style.outline.weight = 2.0; // thick, heavy outlines
        style.interior.hatching = 'cross-hatch';
        style.interior.crossHatch = true;
        break;
        
      case 'crashed_spacecraft':
        style.outline.wobble = 0; // perfectly straight
        style.outline.weight = 1.0;
        style.interior.hatching = 'technical';
        style.motionLines = true;
        if (enemyAnatomy.aura === 'holographic_glitch') {
          style.glitch = { offset: 2, frequency: 0.5 };
        }
        break;
    }
    
    return style;
  }
}
