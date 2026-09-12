---
name: performance-optimizer
description: Frame pacing, stutter elimination, GC optimization, and WebGL rendering quality maintenance
---

# Frame Pacing & Performance Optimizer Agent

This skill ensures Doodle Shooter maintains smooth, uninterrupted 60+ FPS performance without frame glitches, micro-stutters, or GPU hangs.

## Performance Checklist

### 1. High-Fidelity Rendering Without Regressions
- **Target Resolution**: Keep `pixelRatio` crisp (`Math.min(window.devicePixelRatio || 1, 2.0)`). Do not degrade pixel ratio artificially.
- **Render Loop Budget**: Each frame must complete within the 16.6ms budget.
- **Post-Processing Pass**: The full-screen halftone paper & hatching pass is executed in a single composite pass to avoid multi-pass render target ping-ponging.

### 2. Zero-Allocation Inner Loop (GC Stutter Elimination)
- Never create `new THREE.Vector3()`, `new THREE.Matrix4()`, or object literals inside `tick()`, `step()`, `player.update()`, or touch event handlers.
- Use preallocated scratch vectors (`_v`, `_v2`, `_fwd`, `_right`).
- Use reusable collections for touch tracking (`Map`, `Set`) without allocating arrays on every frame.

### 3. Touch Input Smoothing & Jitter Reduction
- Filter micro-jitter from touch digitizers while maintaining instantaneous 1:1 response for quick flicks.
- Cache DOM queries (`getElementById`, `querySelector`) during initialization; never query the DOM in the render loop.
