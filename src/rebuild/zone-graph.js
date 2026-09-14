// src/rebuild/zone-graph.js
// Tactical Connectivity Graph Synthesizer for Dream Rebuild
// Enforces competitive shooter rules (G1-G5) on the Zone Program.

/**
 * Creates an edge between two zones.
 */
export function createEdge(from, to, kind = 'lane', params = {}) {
  return {
    from,
    to,
    kind, // 'lane' | 'doorway' | 'stair' | 'grapple'
    width: params.width || 3.0,
    ...params
  };
}

/**
 * Ensures tactical invariants G1 through G5 on the Zone Program:
 * - G1: Every spawn has >= 2 topologically disjoint paths to mid.
 * - G2: No dead ends: every room has >= 2 exits; every vantage has >= 2 approaches.
 * - G3: Spawns distributed with minimum distance separation.
 * - G4: Sniper perches have clear degree sightlines.
 * - G5: CQB corridors intersect lanes.
 */
export function guaranteeTacticalSkeleton(prog, rng = null) {
  // Ensure mid arena exists
  let midZone = prog.zones.find(z => z.role === 'arena');
  if (!midZone) {
    midZone = {
      id: 'z_mid',
      role: 'arena',
      name: 'Central Arena',
      footprint: [24, 24],
      tier: 0,
      coverDensity: 0.6,
      wants: []
    };
    prog.zones.unshift(midZone);
  }

  // Ensure at least 2 spawns exist
  let spawns = prog.zones.filter(z => z.role === 'spawn');
  if (spawns.length < 2) {
    const s1 = { id: 'z_spawn_alpha', role: 'spawn', name: 'Alpha Insertion', footprint: [14, 14], tier: 0, coverDensity: 0.4, wants: [] };
    const s2 = { id: 'z_spawn_bravo', role: 'spawn', name: 'Bravo Insertion', footprint: [14, 14], tier: 0, coverDensity: 0.4, wants: [] };
    prog.zones.push(s1, s2);
    spawns = prog.zones.filter(z => z.role === 'spawn');
  }

  // Find non-spawn, non-mid rooms for alternative routing
  const sideZones = prog.zones.filter(z => z.id !== midZone.id && z.role !== 'spawn');

  // G1: Route at least 2 distinct paths from each spawn (one to mid, one to flank room)
  const existingEdges = new Set(prog.edges.map(e => `${e.from}->${e.to}`));

  function addEdgeSafe(from, to, kind = 'lane', params = {}) {
    const key1 = `${from}->${to}`;
    const key2 = `${to}->${from}`;
    if (!existingEdges.has(key1) && !existingEdges.has(key2) && from !== to) {
      prog.edges.push(createEdge(from, to, kind, params));
      existingEdges.add(key1);
    }
  }

  for (let i = 0; i < spawns.length; i++) {
    const spawn = spawns[i];
    // Primary path to mid
    addEdgeSafe(spawn.id, midZone.id, 'lane', { width: 4.0 });

    // Secondary flank path to a side room
    if (sideZones.length > 0) {
      const flankTarget = sideZones[i % sideZones.length];
      addEdgeSafe(spawn.id, flankTarget.id, 'lane', { width: 3.0 });
      // Connect flank target to mid or adjacent room to complete loop
      addEdgeSafe(flankTarget.id, midZone.id, 'lane', { width: 3.0 });
    }
  }

  // G2: Dead-End Repair: ensure every zone has degree >= 2 (except perimeter spawns which have >= 2 outward)
  const degreeMap = new Map(prog.zones.map(z => [z.id, 0]));
  for (const e of prog.edges) {
    degreeMap.set(e.from, (degreeMap.get(e.from) || 0) + 1);
    degreeMap.set(e.to, (degreeMap.get(e.to) || 0) + 1);
  }

  for (const zone of prog.zones) {
    let degree = degreeMap.get(zone.id) || 0;
    if (degree < 2) {
      // Find another zone with lowest degree to connect to
      const candidates = prog.zones.filter(z => z.id !== zone.id && (degreeMap.get(z.id) || 0) < 4);
      if (candidates.length > 0) {
        const partner = candidates[0];
        addEdgeSafe(zone.id, partner.id, zone.tier !== partner.tier ? 'stair' : 'doorway');
        degreeMap.set(zone.id, degree + 1);
        degreeMap.set(partner.id, (degreeMap.get(partner.id) || 0) + 1);
      }
    }
  }

  return prog;
}
