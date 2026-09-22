import * as THREE from 'three';
import { INK } from '../render.js';
import { choose, rand } from '../util.js';
import { buildHumanoid } from '../enemies.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

export function buildStudio(B) {
  const { L, box, collider } = B;
  L.key = 'studio';
  // A clean white infinity studio for the main menu showcase
  // We don't draw a solid floor since the background is already paper-white.
  
  // Create a subtle grid pattern on the floor using BLUE ink
  for(let i = -50; i <= 50; i += 10) {
    box(i, 0.05, 0, 0.2, 0.1, 100, { noCollide: true, ink: 0 }); // INK.BLUE = 0
    box(0, 0.05, i, 100, 0.1, 0.2, { noCollide: true, ink: 0 });
  }

  // Put a physical floor collider under the player
  collider(0, -2, 0, 100, 2, 100);
  
  // Position player center-right for the showcase camera
  L.playerStart.set(0, 0, 0); 
  
  B.finish();
  return L;
}