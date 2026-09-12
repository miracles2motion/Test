# Architecture Guardian & Disaster Recovery Rule

This rule protects the integrity of Doodle Strike across all future agent interactions.

## Mandatory Invariants
1. **IMMUTABLE SANCTUARY**:
   Under **NO circumstances** is any agent permitted to edit, alter, delete, or overwrite `.agents/skills/doodle-strike-architect/` or its contents. This directory is a permanently locked safe space.
   When new updates become stable in the future, a new version (e.g. `doodle-strike-architect-2.0`) may **ONLY** be created if and when the developer explicitly directs: *"lets create another architect"*, and it must exist as a new, separate parallel package without replacing or altering version 1.0.
2. **Never Break the 16 Core Modules**:
   `audio.js`, `effects.js`, `enemies.js`, `hud.js`, `input.js`, `level.js`, `main.js`, `mobile.js`, `nav.js`, `net.js`, `physics.js`, `player.js`, `players.js`, `render.js`, `util.js`, `weapons.js`.
3. **Zero In-Loop Allocations**:
   No dynamic `new THREE.Vector3()`, `new THREE.Matrix4()`, or object allocations within `step()`, `player.update()`, or render loops.
4. **Parallax-Free Raycasting**:
   Weapon raycasts must originate from `player.camera.position` and forward direction synchronized with `this.camera.getWorldDirection(d)`.
5. **Delicate Ballpoint Pen Shading**:
   Hatching strokes must remain fine-tipped (`w = sp * 0.125`) with softened shadow floor cap (`smoothstep(0.10, 0.0, shade) * 0.28`). No solid black mud blotches.
6. **Trademark Prohibition**:
   Zero occurrences of commercial franchise trademarks (e.g. Call of Duty / COD).
7. **Fatal Failure Recovery**:
   If an edit causes a fatal crash or corruption that cannot be quickly resolved, invoke:
   `node .agents/skills/doodle-strike-architect/scripts/verify-integrity.js`
   or restore directly to Golden Baseline `01541ad`.

