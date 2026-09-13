/**
 * Doodle Strike - L-System Engine
 * Procedurally generates branching organic structures (trees, coral, vines) using 3D Turtle interpretation.
 */

export class LSystemEngine {
  constructor() {
    this.grammars = {
      TREE: {
        axiom: 'F',
        rules: { 'F': 'FF+[+F-F-F]-[-F+F+F]' },
        angle: 25, length: 2.0, lengthDecay: 0.75, iterations: 3, stochastic: true
      },
      VINE: {
        axiom: 'F',
        rules: { 'F': 'F[+F]F[-F][F]' },
        angle: 15, length: 1.0, lengthDecay: 0.85, iterations: 4, stochastic: true
      }
    };
  }

  // Vector math helpers
  add(a, b) { return [a[0]+b[0], a[1]+b[1], a[2]+b[2]]; }
  scale(a, s) { return [a[0]*s, a[1]*s, a[2]*s]; }
  
  // Rotate vector v around axis k by angle (in radians)
  rotate(v, k, angle) {
    const cosA = Math.cos(angle);
    const sinA = Math.sin(angle);
    const cross = [
      k[1]*v[2] - k[2]*v[1],
      k[2]*v[0] - k[0]*v[2],
      k[0]*v[1] - k[1]*v[0]
    ];
    const dot = k[0]*v[0] + k[1]*v[1] + k[2]*v[2];
    
    return [
      v[0]*cosA + cross[0]*sinA + k[0]*dot*(1-cosA),
      v[1]*cosA + cross[1]*sinA + k[1]*dot*(1-cosA),
      v[2]*cosA + cross[2]*sinA + k[2]*dot*(1-cosA)
    ];
  }

  generate(grammarName, overrides = {}) {
    const grammar = { ...this.grammars[grammarName], ...overrides };
    
    // Phase 1: String Rewriting
    let currentString = grammar.axiom;
    for (let i = 0; i < grammar.iterations; i++) {
      let nextString = '';
      for (const char of currentString) {
        nextString += grammar.rules[char] || char;
      }
      currentString = nextString;
    }

    // Phase 2: 3D Turtle Interpretation
    const turtle = {
      position: [0, 0, 0],
      heading: [0, 1, 0],
      up: [0, 0, 1],
      left: [1, 0, 0],
      stack: [],
      currentLength: grammar.length,
      currentRadius: 0.3,
      depth: 0
    };

    const branches = [];
    const leaves = [];

    for (const char of currentString) {
      const stochasticFactor = grammar.stochastic ? (Math.random() - 0.5) * 10 : 0;
      const angleRad = (grammar.angle + stochasticFactor) * Math.PI / 180;

      switch (char) {
        case 'F':
          const length = turtle.currentLength * (grammar.stochastic ? 0.8 + Math.random() * 0.4 : 1.0);
          const endPos = this.add(turtle.position, this.scale(turtle.heading, length));
          
          branches.push({
            start: [...turtle.position],
            end: [...endPos],
            radius: turtle.currentRadius,
            depth: turtle.depth
          });
          turtle.position = endPos;
          break;
        case '+':
          turtle.heading = this.rotate(turtle.heading, turtle.up, angleRad);
          turtle.left = this.rotate(turtle.left, turtle.up, angleRad);
          break;
        case '-':
          turtle.heading = this.rotate(turtle.heading, turtle.up, -angleRad);
          turtle.left = this.rotate(turtle.left, turtle.up, -angleRad);
          break;
        case '[':
          turtle.stack.push({
            position: [...turtle.position],
            heading: [...turtle.heading],
            up: [...turtle.up],
            left: [...turtle.left],
            currentLength: turtle.currentLength,
            currentRadius: turtle.currentRadius,
            depth: turtle.depth
          });
          turtle.currentLength *= grammar.lengthDecay;
          turtle.currentRadius *= 0.7;
          turtle.depth++;
          break;
        case ']':
          if (turtle.depth >= grammar.iterations - 1) {
            leaves.push({ position: [...turtle.position], size: turtle.currentLength * 2 });
          }
          const state = turtle.stack.pop();
          Object.assign(turtle, state);
          break;
      }
    }

    return { branches, leaves };
  }
}
