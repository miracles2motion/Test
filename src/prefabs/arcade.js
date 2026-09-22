import { INK } from '../render.js';
import * as THREE from 'three';

// ------------------------------------------------------------------
// Retro Arcade Prefab Builders (Missing Implementations)
// ------------------------------------------------------------------

export function buildNeonMarquee(B, x, y, z, o = {}) {
  const { box, addGeo } = B;
  const w = o.w || 6.0;
  const h = o.h || 1.5;
  const d = o.d || 0.4;
  const ink = o.ink ?? INK.ORANGE;
  
  // Backing board
  box(x, y, z, w, h, d, { ink: INK.BLACK });
  // Glowing neon tubes (stylized as floating colored slabs)
  box(x, y, z + d/2 + 0.05, w * 0.8, h * 0.4, 0.1, { ink, noCollide: true });
}

export function buildSkeeBallLane(B, x, y, z, o = {}) {
  const { box, wedge, cyl, ring } = B;
  const ink = o.ink ?? INK.BLACK;
  
  // Lane base
  box(x, y, z, 1.8, 0.4, 8.5, { ink });
  // Cork runaway ramp (wedge)
  wedge(x, y + 0.4, z + 2.0, 1.8, 0.8, 4.0, { ink: INK.ORANGE, dir: '-z' });
  // Target cage housing
  box(x, y + 1.2, z - 3.0, 1.8, 1.6, 2.0, { ink, noCollide: true });
  // Concentric scoring rings
  ring(x, y + 1.8, z - 2.0, 'z');
  // Divider netting
  box(x - 0.9, y + 0.8, z, 0.1, 1.6, 8.5, { ink: INK.BLUE, noCollide: true });
  box(x + 0.9, y + 0.8, z, 0.1, 1.6, 8.5, { ink: INK.BLUE, noCollide: true });
}

export function buildClawMachine(B, x, y, z, o = {}) {
  const { box, slab } = B;
  const ink = o.ink ?? INK.RED;
  
  // Base cabinet
  box(x, y, z, 2.0, 1.0, 2.0, { ink });
  // Glass showcase
  box(x, y + 1.0, z, 1.9, 1.8, 1.9, { ink: INK.BLUE, noCollide: true });
  // Top canopy
  box(x, y + 2.8, z, 2.0, 0.4, 2.0, { ink });
  // Internal claw/rail
  slab(x, y + 2.5, z - 0.9, x + 0.2, y + 2.6, z + 0.9, { ink: INK.BLACK });
  box(x, y + 1.8, z, 0.3, 0.6, 0.3, { ink: INK.BLACK });
}

export function buildAirHockeyTable(B, x, y, z, o = {}) {
  const { box, cyl } = B;
  const ink = o.ink ?? INK.BLACK;
  
  // Table body
  box(x, y + 0.7, z, 2.6, 0.25, 4.8, { ink });
  // Legs
  cyl(x - 1.1, y, z - 2.2, 0.2, 0.7, { ink });
  cyl(x + 1.1, y, z - 2.2, 0.2, 0.7, { ink });
  cyl(x - 1.1, y, z + 2.2, 0.2, 0.7, { ink });
  cyl(x + 1.1, y, z + 2.2, 0.2, 0.7, { ink });
  // Overhead scoring arch
  box(x - 1.4, y + 0.95, z, 0.2, 1.8, 0.2, { ink });
  box(x + 1.4, y + 0.95, z, 0.2, 1.8, 0.2, { ink });
  box(x, y + 2.65, z, 3.0, 0.4, 0.2, { ink: INK.RED });
}

export function buildPrizeCounter(B, x, y, z, o = {}) {
  const { box } = B;
  const ink = o.ink ?? INK.BLACK;
  const w = o.w || 10.0;
  
  // Front counter barricade
  box(x, y, z, w, 1.15, 1.6, { ink });
  // Cash register
  box(x, y + 1.15, z, 0.6, 0.4, 0.5, { ink: INK.BLUE });
  // Glass showcases behind counter
  box(x, y, z - 2.0, w, 2.4, 1.0, { ink: INK.ORANGE });
}

export function buildTicketBooth(B, x, y, z, o = {}) {
  const { box } = B;
  const ink = o.ink ?? INK.BLUE;
  
  // Booth structure
  box(x, y, z, 2.4, 2.8, 2.4, { ink });
  // Ticket window cutout (simulated by inner box)
  box(x, y + 1.0, z + 1.2, 1.2, 0.8, 0.1, { ink: INK.BLACK, noCollide: true });
  // Canopy
  box(x, y + 2.8, z, 2.6, 0.4, 2.6, { ink: INK.ORANGE });
}

export function buildArcadeCarpet(B, x, z, o = {}) {
  const { slab } = B;
  const w = o.w || 8.0;
  const d = o.d || 8.0;
  // A completely flat decorative slab
  slab(x - w/2, z - d/2, x + w/2, z + d/2, 0.01, 0.01, { ink: INK.BLUE, noCollide: true });
}

export function buildCoinOpWall(B, x, y, z, o = {}) {
  const { box } = B;
  const ink = o.ink ?? INK.BLACK;
  const w = o.w || 6.0;
  
  // Wall structure
  box(x, y, z, w, 2.4, 0.8, { ink });
  // Coin slots and token hoppers
  for (let i = -w/2 + 0.8; i < w/2; i += 1.6) {
    box(x + i, y + 1.2, z + 0.4, 0.6, 0.8, 0.1, { ink: INK.ORANGE });
  }
}

export function buildTicketChute(B, x, y, z, o = {}) {
  const { box } = B;
  const ink = o.ink ?? INK.BLUE;
  
  // Conveyor belt body
  box(x, y, z, 1.2, 0.8, 4.0, { ink });
  // Ticket shredder mechanism
  box(x, y + 0.8, z - 1.5, 1.0, 0.6, 1.0, { ink: INK.RED });
}
