/**
 * Doodle Strike - Spline Engine
 * Converts mathematical curves into physical geometry and tessellates them for the pen renderer.
 */

export class SplineEngine {
  constructor(config = {}) {
    this.tessellationResolution = config.tessellationResolution || 0.15;
  }

  // Generate points along a Catmull-Rom spline
  catmullRom(points, tension = 0.5, closed = false) {
    const segments = [];
    const n = closed ? points.length : points.length - 1;
    
    for (let i = 0; i < n; i++) {
      const p0 = points[(i - 1 + points.length) % points.length];
      const p1 = points[i];
      const p2 = points[(i + 1) % points.length];
      const p3 = points[(i + 2) % points.length];
      
      // Fixed resolution for simplicity, could be adaptive based on curvature
      for (let t = 0; t < 1.0; t += this.tessellationResolution) {
        const t2 = t * t;
        const t3 = t2 * t;
        
        const x = 0.5 * ((2 * p1[0]) +
          (-p0[0] + p2[0]) * t * tension +
          (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t2 * tension +
          (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t3 * tension);
          
        const y = 0.5 * ((2 * p1[1]) +
          (-p0[1] + p2[1]) * t * tension +
          (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 * tension +
          (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3 * tension);
          
        const z = 0.5 * ((2 * p1[2]) +
          (-p0[2] + p2[2]) * t * tension +
          (2 * p0[2] - 5 * p1[2] + 4 * p2[2] - p3[2]) * t2 * tension +
          (-p0[2] + 3 * p1[2] - 3 * p2[2] + p3[2]) * t3 * tension);
        
        segments.push([x, y, z]);
      }
    }
    // Push the final point if not closed
    if (!closed) segments.push(points[points.length - 1]);
    
    return segments;
  }

  // Cross product
  cross(a, b) {
    return [
      a[1] * b[2] - a[2] * b[1],
      a[2] * b[0] - a[0] * b[2],
      a[0] * b[1] - a[1] * b[0]
    ];
  }

  // Dot product
  dot(a, b) {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  }

  // Vector subtraction
  sub(a, b) {
    return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
  }

  // Vector magnitude
  mag(a) {
    return Math.sqrt(a[0]*a[0] + a[1]*a[1] + a[2]*a[2]);
  }

  // Vector normalize
  normalize(a) {
    const m = this.mag(a);
    if (m === 0) return [0, 0, 0];
    return [a[0]/m, a[1]/m, a[2]/m];
  }

  computeParallelTransportFrames(points) {
    const frames = [];
    if (points.length < 2) return frames;

    // Initial normal guess
    let tangent = this.normalize(this.sub(points[1], points[0]));
    let up = Math.abs(tangent[1]) > 0.9 ? [1,0,0] : [0,1,0];
    let prevNormal = this.normalize(this.cross(tangent, up));

    for (let i = 0; i < points.length - 1; i++) {
      const tNext = this.normalize(this.sub(points[i + 1], points[i]));
      const tPrev = i > 0 ? this.normalize(this.sub(points[i], points[i - 1])) : tNext;
      
      const axis = this.cross(tPrev, tNext);
      const axisLen = this.mag(axis);
      
      if (axisLen > 0.001) {
        // Rotate prevNormal around axis (simplified Rodrigues' rotation)
        const angle = Math.acos(Math.max(-1, Math.min(1, this.dot(tPrev, tNext))));
        const k = this.normalize(axis);
        const cosA = Math.cos(angle);
        const sinA = Math.sin(angle);
        
        const v = prevNormal;
        const crossKV = this.cross(k, v);
        const dotKV = this.dot(k, v);
        
        prevNormal = [
          v[0]*cosA + crossKV[0]*sinA + k[0]*dotKV*(1-cosA),
          v[1]*cosA + crossKV[1]*sinA + k[1]*dotKV*(1-cosA),
          v[2]*cosA + crossKV[2]*sinA + k[2]*dotKV*(1-cosA)
        ];
        prevNormal = this.normalize(prevNormal);
      }
      
      const binormal = this.normalize(this.cross(tNext, prevNormal));
      frames.push({ origin: points[i], tangent: tNext, normal: prevNormal, binormal });
    }
    return frames;
  }

  extrudeAlongPath(splinePoints, profile, options = {}) {
    const { taper = 1.0, scaleVariation = 0 } = options;
    const geometry = [];
    const frames = this.computeParallelTransportFrames(splinePoints);

    for (let i = 0; i < frames.length; i++) {
      const t = i / (frames.length - 1);
      const localScale = taper + (1 - taper) * (1 - t);
      const jitter = 1 + (Math.random() - 0.5) * scaleVariation;
      const frame = frames[i];

      const ring = profile.map(p2d => {
        const scaledX = p2d[0] * localScale * jitter;
        const scaledY = p2d[1] * localScale * jitter;
        return [
          frame.origin[0] + frame.normal[0] * scaledX + frame.binormal[0] * scaledY,
          frame.origin[1] + frame.normal[1] * scaledX + frame.binormal[1] * scaledY,
          frame.origin[2] + frame.normal[2] * scaledX + frame.binormal[2] * scaledY
        ];
      });

      geometry.push(ring);
    }
    return { rings: geometry, frames };
  }
}
