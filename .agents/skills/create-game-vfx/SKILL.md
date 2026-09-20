---
name: create-game-vfx
description: Create readable, performance-safe Three.js game visual effects for Doodle Strike. Use for attacks, impacts, ink splatters, damage feedback, status effects, projectile trails, particles, shaders, telegraphs, quality tiers, and reduced-motion alternatives.
---

# Create Game VFX — Doodle Strike Standard

Make the tactical gameplay meaning visible through authentic ballpoint/drafting biro ink visual metaphors before adding spectacle.

## Doodle Strike VFX Metaphors & Ink Vocabulary
- **Ink Bloom & Splatters**: Hits, explosions, and wall impacts create circular biro ink bleeding droplets and concentric ripple rings rather than generic fiery particle explosions.
- **Telegraphs**: Use dashed pen strokes (`lineDash: [0.3, 0.3]`) and drafting radius rings (drawn in `INK.ORANGE` or `INK.RED`) on the notebook surface.
- **Muzzle Scribbles**: Gunshots emit quick, hand-sketched spiral/scribble burst lines that collapse within 80ms.
- **Paper Shrapnel**: Debris consists of micro paper tear geometry or ink-fleck quads pooled deterministically.

## Specify

For every effect define trigger, owner, duration, gameplay meaning, camera-distance silhouette, color hierarchy (e.g., `INK.RED` for threat, `INK.ORANGE` for interaction, `INK.BLUE` for structures), spawn cap, cleanup rule, and reduced-motion equivalent. Separate telegraph, contact, success, failure, and lingering status visuals.

## Implement Safely

Pool short-lived objects, reuse materials/geometry, cap particles (max 64 active ink drops), and avoid per-frame allocation. Use non-colliding visual primitives (`noCollide: true`). Make cleanup idempotent so reset, death, and pause cannot leak effects.

## Verify

Test overlaps, multiple targets, rapid repetition, pause/resume, lowest quality, reduced motion, and touch viewports. Verify frame budget and draw call overhead under 60 FPS.

