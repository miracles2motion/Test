---
name: blender-level-artisan
description: "Master Blender 3D architectural, organic, and prop modeling workflow for Doodle Strike. Governs live socket interaction (port 9876), high-fidelity beveled geometry, GLB asset pipelines, and Three.js ink-shader integration."
risk: safe
source: local
date_added: "2026-09-27"
---

# Blender Level Artisan: 3D Asset & Architecture Blueprint

This skill governs creating high-fidelity 3D assets, macro landmarks, and environment props in Blender and piping them seamlessly into Doodle Strike.

---

## 1. Live Blender MCP Architecture
- **Host & Port**: `localhost:9876` (managed via `MCP for Blender` addon).
- **Bridge CLI**: `python tools/blender_bridge.py [info|exec|clear|export]`.
- **Primary Scripting**: Direct execution of Blender Python (`bpy`) to generate, sculpt, modify, and export assets.

---

## 2. The Anti-Primitive Law (Why Box Primitives Look Like Trash)
1. **Never use raw un-beveled cubes**: Every stone slab, column, step, or wall must have beveling (`BEVEL` modifier or chamfered topology) with angle limits to catch light and ink hatching.
2. **Organic Variations**: Slabs and ruins must have slight asymmetrical vertex offsets, weathered notches, and broken edges rather than perfect digital symmetry.
3. **Hero Silhouettes**: Landmarks must have distinctive stepped contours, cantilevered cornices, and architectural depth (recessed portals, protruding friezes).

---

## 3. Standard Asset Generation & Export Pipeline
1. **Model in Blender**: Run Python generator or sculpt interactively.
2. **Clean Normals**: Use `bpy.ops.object.shade_smooth()` with angle-based normal weighting.
3. **Export GLB**:
   ```python
   bpy.ops.export_scene.gltf(
       filepath=r'C:\Users\dd\Desktop\Test\assets\models\<asset_name>.glb',
       export_format='GLB',
       use_selection=False
   )
   ```
4. **Three.js Loading**:
   In `src/levels/<map>.js` or `src/prefabs.js`:
   Load via `GLTFLoader` (`vendor/three/addons/loaders/GLTFLoader.js`), apply `makeInkMaterial` for biro sketch styling, and add colliders for player traversal.

---

## 4. Visual Verification (The "See What You Made" Rule)
Follow `design-spatial` and `lookdev`: never trust raw code generation alone. Always inspect the viewport in Blender or take screenshots in-game to verify spatial scale, sightlines, and aesthetic beauty before completing.
