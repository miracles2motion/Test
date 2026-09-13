/**
 * Doodle Strike - Pen Stylizer
 * Applies organic wobble, angular jitter, and hatching lines to perfectly flat geometry 
 * so it looks like it was drawn by a human with a ballpoint pen.
 */

export class PenStylizer {
  constructor() {
    this.penProfiles = {
      fine: { width: 0.3, pressure: 0.4, jitter: 0.02 },
      medium: { width: 0.6, pressure: 0.6, jitter: 0.04 },
      bold: { width: 1.2, pressure: 0.8, jitter: 0.06 },
      sketch: { width: 0.4, pressure: 0.3, jitter: 0.12 }
    };
  }

  // Simple pseudo-random hash function for deterministic wobble
  hash(x, y, z) {
    let h = Math.sin(x * 12.9898 + y * 78.233 + z * 37.719) * 43758.5453;
    return h - Math.floor(h);
  }

  // Add organic wobble (Perlin-like noise) to a set of points
  applyOrganicWobble(points, amplitude = 0.03) {
    return points.map(p => {
      // Very cheap noise displacement
      const noiseX = (this.hash(p[0], p[1], p[2]) - 0.5) * amplitude;
      const noiseY = (this.hash(p[1], p[2], p[0]) - 0.5) * amplitude;
      const noiseZ = (this.hash(p[2], p[0], p[1]) - 0.5) * amplitude;
      return [p[0] + noiseX, p[1] + noiseY, p[2] + noiseZ];
    });
  }

  // Add angular jitter (sharp, choppy strokes for rocks/caves)
  applyAngularJitter(points, intensity = 0.05) {
    return points.map(p => {
      // Choppy displacement
      const noiseX = (Math.random() < 0.5 ? 1 : -1) * this.hash(p[0], 0, 0) * intensity;
      const noiseZ = (Math.random() < 0.5 ? 1 : -1) * this.hash(0, 0, p[2]) * intensity;
      return [p[0] + noiseX, p[1], p[2] + noiseZ];
    });
  }

  stylize(geometryType, rawStrokes, style = 'botanical') {
    const stylized = [];

    for (const stroke of rawStrokes) {
      const points = stroke.points;
      
      switch (style) {
        case 'botanical':
          // Wobbly lines, thicker at base
          stylized.push({
            type: 'stroke',
            points: this.applyOrganicWobble(points, 0.04),
            weight: 0.8,
            color: 'blue'
          });
          break;
          
        case 'geological':
          // Angular, choppy strokes
          stylized.push({
            type: 'stroke',
            points: this.applyAngularJitter(points, 0.06),
            weight: 1.0,
            color: 'black'
          });
          break;
          
        case 'bioluminescent':
          // Double-stroke (outer glow, inner bright)
          stylized.push({
            type: 'stroke',
            points: points,
            weight: 2.0,
            color: 'green',
            opacity: 0.3
          });
          stylized.push({
            type: 'stroke',
            points: points,
            weight: 0.5,
            color: 'white',
            opacity: 1.0
          });
          break;
          
        default:
          stylized.push({
            type: 'stroke',
            points: points,
            weight: 0.5,
            color: 'black'
          });
      }
    }

    return stylized;
  }
}
