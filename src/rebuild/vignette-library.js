// src/rebuild/vignette-library.js
// Vignette Micro-Scene Catalog & Slot Grammar for Dream Rebuild
// Replaces random prop scattering with authored, contextual set-pieces.

export const VIGNETTE_LIBRARY = {
  checkpoint: {
    id: 'checkpoint',
    name: 'Security Inspection Checkpoint',
    themes: ['space_station', 'station', 'cyber', 'steampunk', 'colossal'],
    size: [4, 3],
    tierAny: true,
    slots: [
      { role: 'barrier', anchor: 'laneEdge', fills: ['buildCrateStack', 'buildSandbagRow', 'buildOxygenTankRack'] },
      { role: 'terminal', anchor: 'wallAdjacent', fills: ['buildTelemetryConsole', 'buildToolRack'] },
      { role: 'beacon', anchor: 'corner', fills: ['buildHoloPylon', 'buildWarningSign'] }
    ],
    cover: { hard: 2, soft: 1 },
    narrative: 'A secured threshold controlling passage between zones'
  },

  sensor_station: {
    id: 'sensor_station',
    name: 'Telemetry & Sensor Relay Post',
    themes: ['space_station', 'station', 'cyber'],
    size: [4, 4],
    tierAny: true,
    slots: [
      { role: 'console', anchor: 'center', fills: ['buildTelemetryConsole'] },
      { role: 'antenna', anchor: 'corner', fills: ['buildAntennaWhip', 'buildHoloPylon'] },
      { role: 'cryo', anchor: 'wallAdjacent', fills: ['buildCryoPod', 'buildOxygenTankRack'] }
    ],
    cover: { hard: 2, soft: 0 },
    narrative: 'A communications terminal logging local traffic'
  },

  campfire_camp: {
    id: 'campfire_camp',
    name: 'Patrol Campfire Hearth',
    themes: ['forest', 'maritime'],
    size: [5, 4],
    tierAny: false,
    slots: [
      { role: 'hearth', anchor: 'center', fills: ['buildCampfire'] },
      { role: 'seating', anchor: 'ring', fills: ['buildChoppingBlock', 'buildHollowLog'] },
      { role: 'store', anchor: 'edgeSightline', fills: ['buildWoodStack', 'buildLoggingCart'] }
    ],
    cover: { hard: 1, soft: 2 },
    narrative: 'A tactical resting campsite'
  },

  zen_shrine: {
    id: 'zen_shrine',
    name: 'Kasuga Stone Lantern Meditation Shrine',
    themes: ['zen'],
    size: [4, 4],
    tierAny: true,
    slots: [
      { role: 'lantern', anchor: 'center', fills: ['buildStoneLantern'] },
      { role: 'water', anchor: 'corner', fills: ['buildBambooFountain'] },
      { role: 'seating', anchor: 'wallAdjacent', fills: ['buildStoneLantern'] }
    ],
    cover: { hard: 2, soft: 1 },
    narrative: 'A quiet reflective sanctuary'
  },

  boiler_station: {
    id: 'boiler_station',
    name: 'Steam Manifold & Pressure Station',
    themes: ['steampunk'],
    size: [4, 3],
    tierAny: true,
    slots: [
      { role: 'valves', anchor: 'wallAdjacent', fills: ['buildValveBank'] },
      { role: 'gauge', anchor: 'corner', fills: ['buildPressureGauge'] },
      { role: 'trolley', anchor: 'laneEdge', fills: ['buildCrateStack', 'buildToolRack'] }
    ],
    cover: { hard: 2, soft: 1 },
    narrative: 'An industrial pressure monitoring station'
  },

  barricade_choke: {
    id: 'barricade_choke',
    name: 'Fortified Tactical Sandbag Choke',
    themes: ['space_station', 'station', 'cyber', 'steampunk', 'maritime', 'forest', 'colossal'],
    size: [5, 3],
    tierAny: true,
    slots: [
      { role: 'barrier_left', anchor: 'laneEdge', fills: ['buildSandbagRow', 'buildCrateStack'] },
      { role: 'barrier_right', anchor: 'laneEdge', fills: ['buildSandbagRow', 'buildCrateStack'] },
      { role: 'sign', anchor: 'corner', fills: ['buildWarningSign', 'buildAntennaWhip'] }
    ],
    cover: { hard: 3, soft: 0 },
    narrative: 'A deliberate choke point fortification'
  },

  dock_cache: {
    id: 'dock_cache',
    name: 'Maritime Dock Cargo Cache',
    themes: ['maritime'],
    size: [4, 3],
    tierAny: true,
    slots: [
      { role: 'rope', anchor: 'corner', fills: ['buildRopeCoil'] },
      { role: 'crates', anchor: 'wallAdjacent', fills: ['buildCrateStack'] },
      { role: 'tools', anchor: 'laneEdge', fills: ['buildToolRack'] }
    ],
    cover: { hard: 2, soft: 1 },
    narrative: 'Shipping cargo staged along the dock apron'
  },

  classroom_nook: {
    id: 'classroom_nook',
    name: 'Chalkboard & Study Barricade',
    themes: ['colossal'],
    size: [5, 4],
    tierAny: true,
    slots: [
      { role: 'board', anchor: 'wallAdjacent', fills: ['buildChalkboardWall'] },
      { role: 'supplies', anchor: 'corner', fills: ['buildCrateStack'] },
      { role: 'station', anchor: 'center', fills: ['buildToolRack'] }
    ],
    cover: { hard: 2, soft: 1 },
    narrative: 'An academic work station'
  }
};
