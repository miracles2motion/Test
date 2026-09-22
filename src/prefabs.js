import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

// Import categorized prefabs
import * as NaturePrefabs from './prefabs/nature.js';
import * as ArchPrefabs from './prefabs/architecture.js';
import * as PropsPrefabs from './prefabs/props.js';
import * as ArcadePrefabs from './prefabs/arcade.js';

// Re-export them so other files can still import from './prefabs.js'
export const {
  buildAncientTree,
  buildPineTree,
  buildWillowTree,
  buildGiantMushroom,
  buildGrassClump,
  buildFernCluster,
  buildHollowLog,
  buildLoggingCart,
  buildHollowStump,
  buildToadstoolCluster,
  generateParametricTree,
  buildCurvedHollowLog,
  buildBoulderField,
  buildGiantGrass,
  buildTreehouse,
  buildLeafLitter,
  buildWaterRipples,
  buildWaterTower
} = NaturePrefabs;

export const {
  buildSuspendedRopeBridge,
  buildSuspensionBridge,
  buildChalkboardWall,
  buildTerminalClockTower,
  buildSpaceFrameConcourse,
  buildTransitUnderpass,
  buildTechnicalFraming
} = ArchPrefabs;

export const {
  buildCampfire,
  buildWoodStack,
  buildTrailSign,
  buildChoppingBlock,
  buildSurveyTable,
  buildFullGalleon,
  buildCar,
  buildBookStack,
  buildOpenBookRamp,
  buildDeskLamp,
  buildInkwellCover,
  buildSolarArray,
  buildCryoPod,
  buildAirlockHatch,
  buildCentrifugeRing,
  buildHydroponicTray,
  buildCommunicationsDish,
  buildOxygenTankRack,
  buildTelemetryConsole,
  buildStoneLantern,
  buildBambooFountain,
  buildHoloPylon,
  buildValveBank,
  buildPressureGauge,
  buildCrateStack,
  buildSandbagRow,
  buildAntennaWhip,
  buildRopeCoil,
  buildToolRack,
  buildWarningSign,
  buildTransitBus,
  buildTransitBench,
  buildPassengerShelter,
  buildUrbanDecals,
  buildCompoundParts,
  buildBlobShadow,
  buildBambooLantern,
  buildAtmosphericBeams,
  buildInkSplatters,
  buildArcadeCabinet,
  buildPinballBumper,
  buildLocomotiveBoiler,
  buildBunsenBurner,
  buildPinballMachine
} = PropsPrefabs;

export const {
  buildNeonMarquee,
  buildSkeeBallLane,
  buildClawMachine,
  buildAirHockeyTable,
  buildPrizeCounter,
  buildTicketBooth,
  buildArcadeCarpet,
  buildCoinOpWall,
  buildTicketChute
} = ArcadePrefabs;

import { INK } from './render.js';
import { createRNG } from './rebuild/prng.js';
import { annularDeck } from './spline-engine.js';
import { buildCreatureSkeleton, buildOrganicFish, buildBambooPlantation, buildTerracedRidge } from './anatomy-grammar.js';

export { buildCreatureSkeleton, buildOrganicFish, buildBambooPlantation, buildTerracedRidge };

// ============================================================================
// DYNAMIC PREFAB REGISTRY & TEACHING CATALOG
// Allows Dream to query, inspect, and instantiate any 3D compound structure.
// ============================================================================
export const PREFAB_REGISTRY = {
  ancient_tree: {
    id: 'ancient_tree',
    name: 'Ancient Banyan / Oak Tree',
    tags: ['forest', 'nature', 'woodland', 'jungle', 'tree'],
    builder: buildAncientTree,
    footprint: [11.0, 18.0, 11.0]
  },
  pine_tree: {
    id: 'pine_tree',
    name: 'Alpine Conifer / Pine Tree',
    tags: ['forest', 'pine', 'nature', 'mountain', 'tree'],
    builder: buildPineTree,
    footprint: [8.0, 14.0, 8.0]
  },
  willow_tree: {
    id: 'willow_tree',
    name: 'Weeping Willow Tree',
    tags: ['forest', 'willow', 'swamp', 'water', 'tree'],
    builder: buildWillowTree,
    footprint: [11.0, 12.0, 11.0]
  },
  giant_mushroom: {
    id: 'giant_mushroom',
    name: 'Giant Umbrella Mushroom Platform',
    tags: ['forest', 'fungus', 'swamp', 'nature'],
    builder: buildGiantMushroom,
    footprint: [6.0, 7.0, 6.0]
  },
  hollow_log: {
    id: 'hollow_log',
    name: 'Run-Through Hollow Log Tunnel',
    tags: ['forest', 'log', 'cover', 'tunnel'],
    builder: buildHollowLog,
    footprint: [4.0, 3.5, 10.0]
  },
  grass_clump: {
    id: 'grass_clump',
    name: 'Stylized Ballpoint Grass Clump',
    tags: ['forest', 'flora', 'grass', 'underbrush'],
    builder: buildGrassClump,
    footprint: [1.2, 0.8, 1.2]
  },
  fern_cluster: {
    id: 'fern_cluster',
    name: 'Radiating Arched Fern Fronds',
    tags: ['forest', 'flora', 'fern', 'cover'],
    builder: buildFernCluster,
    footprint: [2.5, 1.2, 2.5]
  },
  suspension_bridge: {
    id: 'suspension_bridge',
    name: 'Suspended Timber Rope Bridge',
    tags: ['forest', 'maritime', 'bridge', 'walkway'],
    builder: buildSuspendedRopeBridge,
    footprint: [3.0, 4.0, 14.0]
  },
  suspended_rope_bridge: {
    id: 'suspended_rope_bridge',
    name: 'Procedural Catenary Rope Bridge',
    tags: ['forest', 'maritime', 'bridge', 'rope', 'walkway'],
    builder: buildSuspendedRopeBridge,
    footprint: [3.0, 4.0, 14.0]
  },
  full_galleon: {
    id: 'full_galleon',
    name: 'Multi-Deck Pirate Galleon Warship',
    tags: ['maritime', 'ship', 'pirate', 'ocean', 'harbor'],
    builder: buildFullGalleon,
    footprint: [14.0, 30.0, 40.0]
  },
  book_stack: {
    id: 'book_stack',
    name: 'Stepped Hardback Book Stack',
    tags: ['colossal', 'classroom', 'library', 'desk'],
    builder: buildBookStack,
    footprint: [8.0, 4.0, 11.0]
  },
  open_book_ramp: {
    id: 'open_book_ramp',
    name: 'Ascending Book Ramp',
    tags: ['colossal', 'classroom', 'library', 'ramp'],
    builder: buildOpenBookRamp,
    footprint: [6.0, 3.5, 8.0]
  },
  desk_lamp: {
    id: 'desk_lamp',
    name: 'Monumental Articulated Desk Lamp',
    tags: ['colossal', 'classroom', 'lamp', 'overlook'],
    builder: buildDeskLamp,
    footprint: [16.0, 22.0, 8.0]
  },
  inkwell_cover: {
    id: 'inkwell_cover',
    name: 'Octagonal Inkwell Cover',
    tags: ['colossal', 'classroom', 'inkwell', 'cover'],
    builder: buildInkwellCover,
    footprint: [6.0, 3.0, 6.0]
  },
  campfire: {
    id: 'campfire',
    name: 'Ranger Campfire Pit',
    tags: ['forest', 'camp', 'fire', 'light', 'outpost'],
    builder: buildCampfire,
    footprint: [2.0, 0.8, 2.0]
  },
  wood_stack: {
    id: 'wood_stack',
    name: 'Cordwood Fuel Stack',
    tags: ['forest', 'wood', 'cover', 'lumber'],
    builder: buildWoodStack,
    footprint: [2.6, 1.2, 1.4]
  },
  trail_sign: {
    id: 'trail_sign',
    name: 'Weathered Trail Signpost',
    tags: ['forest', 'sign', 'waypoint', 'trail'],
    builder: buildTrailSign,
    footprint: [1.6, 2.5, 1.6]
  },
  chopping_block: {
    id: 'chopping_block',
    name: 'Woodcutters Chopping Block & Axe',
    tags: ['forest', 'camp', 'axe', 'lumber', 'cover'],
    builder: buildChoppingBlock,
    footprint: [1.4, 1.4, 1.4]
  },
  logging_cart: {
    id: 'logging_cart',
    name: 'Timber Logging Handcart',
    tags: ['forest', 'cart', 'lumber', 'transport', 'cover'],
    builder: buildLoggingCart,
    footprint: [3.4, 1.3, 2.0]
  },
  hollow_stump: {
    id: 'hollow_stump',
    name: 'Hollow Tree Stump Bunker',
    tags: ['forest', 'stump', 'cover', 'bunker'],
    builder: buildHollowStump,
    footprint: [2.8, 1.3, 2.8]
  },
  toadstools: {
    id: 'toadstools',
    name: 'Fly Agaric Toadstool Cluster',
    tags: ['forest', 'mushroom', 'flora', 'decoration'],
    builder: buildToadstoolCluster,
    footprint: [1.5, 0.8, 1.5]
  },
  survey_table: {
    id: 'survey_table',
    name: 'Canopy Survey Table & Instruments',
    tags: ['forest', 'table', 'survey', 'furniture', 'cover'],
    builder: buildSurveyTable,
    footprint: [2.8, 1.5, 1.8]
  },
  solar_array: {
    id: 'solar_array',
    name: 'Articulated Photovoltaic Solar Array',
    tags: ['space_station', 'station', 'space', 'solar', 'power', 'cover'],
    builder: buildSolarArray,
    footprint: [11.0, 6.5, 3.5]
  },
  cryo_pod: {
    id: 'cryo_pod',
    name: 'Cryo-Stasis Sleeper Pod',
    tags: ['space_station', 'station', 'space', 'stasis', 'pod', 'cover'],
    builder: buildCryoPod,
    footprint: [1.8, 1.3, 2.4]
  },
  airlock_hatch: {
    id: 'airlock_hatch',
    name: 'Pressurized Airlock Hatch Bulkhead',
    tags: ['space_station', 'station', 'space', 'airlock', 'door', 'hatch'],
    builder: buildAirlockHatch,
    footprint: [3.4, 4.2, 1.2]
  },
  centrifuge_ring: {
    id: 'centrifuge_ring',
    name: 'Habitat Centrifuge Core Hub & Ring',
    tags: ['space_station', 'station', 'space', 'centrifuge', 'hab', 'landmark'],
    builder: buildCentrifugeRing,
    footprint: [12.0, 10.5, 12.0]
  },
  hydroponic_tray: {
    id: 'hydroponic_tray',
    name: 'Hydroponic Algae Growth Bay',
    tags: ['space_station', 'station', 'space', 'hydroponic', 'algae', 'cover'],
    builder: buildHydroponicTray,
    footprint: [2.8, 2.2, 1.6]
  },
  communications_dish: {
    id: 'communications_dish',
    name: 'Deep-Space Communications Parabolic Dish',
    tags: ['space_station', 'station', 'space', 'antenna', 'dish', 'comms'],
    builder: buildCommunicationsDish,
    footprint: [6.5, 8.5, 6.5]
  },
  oxygen_tank_rack: {
    id: 'oxygen_tank_rack',
    name: 'High-Pressure Oxygen Tank Rack',
    tags: ['space_station', 'station', 'space', 'oxygen', 'gas', 'tank', 'cover'],
    builder: buildOxygenTankRack,
    footprint: [2.4, 1.4, 1.2]
  },
  telemetry_console: {
    id: 'telemetry_console',
    name: 'Telemetry Flight Station & Avionics Terminal',
    tags: ['space_station', 'station', 'space', 'terminal', 'console', 'computer', 'cover'],
    builder: buildTelemetryConsole,
    footprint: [2.2, 1.4, 1.8]
  },
  stone_lantern: {
    id: 'stone_lantern',
    name: 'Stone Lantern (Kasuga Toro)',
    tags: ['zen', 'shrine', 'garden', 'lantern', 'cover'],
    builder: buildStoneLantern,
    footprint: [0.8, 1.6, 0.8]
  },
  bamboo_fountain: {
    id: 'bamboo_fountain',
    name: 'Bamboo Rocking Water Fountain',
    tags: ['zen', 'garden', 'bamboo', 'water', 'fountain'],
    builder: buildBambooFountain,
    footprint: [1.0, 1.2, 1.0]
  },
  holo_pylon: {
    id: 'holo_pylon',
    name: 'Holographic Pylon Beacon',
    tags: ['cyber', 'beacon', 'holo', 'pylon', 'cover'],
    builder: buildHoloPylon,
    footprint: [0.7, 2.7, 0.7]
  },
  valve_bank: {
    id: 'valve_bank',
    name: 'Industrial Steam Valve Manifold Bank',
    tags: ['steampunk', 'steam', 'valve', 'pipe', 'cover'],
    builder: buildValveBank,
    footprint: [2.0, 1.1, 0.8]
  },
  pressure_gauge: {
    id: 'pressure_gauge',
    name: 'Brass Dial Pressure Gauge',
    tags: ['steampunk', 'steam', 'dial', 'gauge', 'cover'],
    builder: buildPressureGauge,
    footprint: [0.7, 1.5, 0.3]
  },
  chalkboard_wall: {
    id: 'chalkboard_wall',
    name: 'Slate Chalkboard Wall',
    tags: ['colossal', 'classroom', 'chalkboard', 'cover'],
    builder: buildChalkboardWall,
    footprint: [2.6, 2.8, 0.6]
  },
  crate_stack: {
    id: 'crate_stack',
    name: 'Wooden Shipping Crate Stack',
    tags: ['universal', 'crate', 'cover', 'cargo', 'box'],
    builder: buildCrateStack,
    footprint: [1.8, 1.7, 1.0]
  },
  sandbag_row: {
    id: 'sandbag_row',
    name: 'Canvas Sandbag Barricade Row',
    tags: ['universal', 'sandbag', 'cover', 'barricade'],
    builder: buildSandbagRow,
    footprint: [2.1, 1.0, 0.9]
  },
  antenna_whip: {
    id: 'antenna_whip',
    name: 'Whip Antenna Comms Post',
    tags: ['universal', 'antenna', 'comms', 'mast'],
    builder: buildAntennaWhip,
    footprint: [0.6, 4.0, 0.6]
  },
  rope_coil: {
    id: 'rope_coil',
    name: 'Manila Hemp Rope Coil',
    tags: ['maritime', 'rope', 'hawser', 'cover'],
    builder: buildRopeCoil,
    footprint: [1.1, 0.3, 1.1]
  },
  tool_rack: {
    id: 'tool_rack',
    name: 'Workshop Equipment & Tool Rack',
    tags: ['universal', 'tools', 'rack', 'cover'],
    builder: buildToolRack,
    footprint: [1.6, 1.4, 0.4]
  },
  warning_sign: {
    id: 'warning_sign',
    name: 'Hazard Caution Warning Sign',
    tags: ['universal', 'sign', 'hazard', 'caution'],
    builder: buildWarningSign,
    footprint: [0.6, 1.4, 0.2]
  },
  parametric_tree: {
    id: 'parametric_tree',
    name: 'Parametric Organic Tree (Titan/Slender/Gnarled)',
    tags: ['forest', 'organic', 'tree', 'canopy', 'colossal', 'cover', 'grapple'],
    builder: generateParametricTree,
    footprint: [12.0, 30.0, 12.0]
  },
  curved_hollow_log: {
    id: 'curved_hollow_log',
    name: 'Curved Hollow Log Sprint Tunnel',
    tags: ['forest', 'log', 'tunnel', 'cqb', 'catwalk', 'corridor', 'cover'],
    builder: buildCurvedHollowLog,
    footprint: [6.0, 4.0, 18.0]
  },
  boulder_field: {
    id: 'boulder_field',
    name: 'Faceted Boulder Cover Field',
    tags: ['universal', 'rock', 'boulder', 'cover', 'tactical'],
    builder: buildBoulderField,
    footprint: [8.0, 3.0, 8.0]
  },
  giant_grass: {
    id: 'giant_grass',
    name: 'Giant Stalk Grass with Grapple Ring',
    tags: ['forest', 'grass', 'grapple', 'cover', 'nature', 'flora'],
    builder: buildGiantGrass,
    footprint: [2.5, 7.0, 2.5]
  },
  treehouse: {
    id: 'treehouse',
    name: 'Colossal Titan Treehouse Fortress',
    tags: ['forest', 'treehouse', 'colossal', 'tree', 'catwalk', 'cabin', 'grapple', 'landmark'],
    builder: buildTreehouse,
    footprint: [12.0, 26.0, 12.0]
  },
  creature_skeleton: {
    id: 'creature_skeleton',
    name: 'Leviathan Creature Skeleton Sprint Tunnel',
    tags: ['creature', 'skeleton', 'tunnel', 'defilade', 'ribcage', 'corridor'],
    builder: buildCreatureSkeleton,
    footprint: [6.0, 5.0, 24.0]
  },
  organic_fish: {
    id: 'organic_fish',
    name: 'Organic Swept Spline Fish Leviathan',
    tags: ['creature', 'fish', 'spline', 'loft', 'landmark'],
    builder: buildOrganicFish,
    footprint: [8.0, 6.0, 24.0]
  },
  bamboo_plantation: {
    id: 'bamboo_plantation',
    name: 'Dense Procedural Bamboo Plantation',
    tags: ['forest', 'bamboo', 'plantation', 'grove', 'cqb', 'cover'],
    builder: buildBambooPlantation,
    footprint: [24.0, 12.0, 24.0]
  },
  terraced_ridge: {
    id: 'terraced_ridge',
    name: 'Natural Terraced Rock Ledge Ridge',
    tags: ['nature', 'rock', 'terrace', 'elevation', 'traverse'],
    builder: buildTerracedRidge,
    footprint: [12.0, 5.0, 18.0]
  },
  atmospheric_beams: {
    id: 'atmospheric_beams',
    name: 'Crepuscular Sky Rays & Atmospheric Beams',
    tags: ['atmosphere', 'sky-rays', 'lighting', 'vfx'],
    builder: buildAtmosphericBeams,
    footprint: [14.0, 20.0, 14.0]
  },
  ink_splatters: {
    id: 'ink_splatters',
    name: 'Biro Ink Droplet & Splatter Decal Cluster',
    tags: ['vfx', 'ink', 'splatter', 'paper', 'decal'],
    builder: buildInkSplatters,
    footprint: [2.5, 0.1, 2.5]
  },
  technical_framing: {
    id: 'technical_framing',
    name: 'Drafting Paper Technical Framing & Elevation Stamp',
    tags: ['framing', 'paper-technical', 'drafting', 'brackets'],
    builder: buildTechnicalFraming,
    footprint: [8.0, 0.2, 8.0]
  },
  transit_bus: {
    id: 'transit_bus',
    name: 'Monumental 12m Transit Commuter Bus',
    tags: ['urban', 'bus', 'transit', 'vehicle', 'landmark', 'cover'],
    builder: buildTransitBus,
    footprint: [2.8, 3.2, 11.5]
  },
  terminal_clock_tower: {
    id: 'terminal_clock_tower',
    name: 'Central Terminal Clock & Schedule Departure Tower',
    tags: ['urban', 'clock', 'tower', 'transit', 'station', 'landmark'],
    builder: buildTerminalClockTower,
    footprint: [3.4, 15.6, 3.4]
  },
  transit_bench: {
    id: 'transit_bench',
    name: 'Perforated Transit Passenger Waiting Bench',
    tags: ['urban', 'bench', 'transit', 'cover', 'tactical'],
    builder: buildTransitBench,
    footprint: [1.9, 0.9, 0.6]
  },
  passenger_shelter: {
    id: 'passenger_shelter',
    name: 'Cantilever Passenger Boarding Shelter',
    tags: ['urban', 'shelter', 'canopy', 'transit', 'cover'],
    builder: buildPassengerShelter,
    footprint: [7.2, 3.4, 3.2]
  },
  space_frame_concourse: {
    id: 'space_frame_concourse',
    name: 'Curved Space-Frame Concourse Steel Arch',
    tags: ['urban', 'transit', 'arch', 'canopy', 'roof', 'landmark'],
    builder: buildSpaceFrameConcourse,
    footprint: [36.0, 12.0, 48.0]
  },
  transit_underpass: {
    id: 'transit_underpass',
    name: 'Tiled Subterranean Transit Underpass',
    tags: ['urban', 'transit', 'underpass', 'tunnel', 'stairs', 'cqb'],
    builder: buildTransitUnderpass,
    footprint: [4.0, 3.0, 24.0]
  },
  urban_decals: {
    id: 'urban_decals',
    name: 'Urban Ground Decals & Drainage Grates',
    tags: ['urban', 'transit', 'decal', 'pavement', 'drain'],
    builder: buildUrbanDecals,
    footprint: [4.0, 0.1, 4.0]
  },
  arcade_cabinet: {
    id: 'arcade_cabinet',
    name: 'Vintage Upright Arcade Cabinet Pod',
    tags: ['arcade', 'retro_arcade', 'cabinet', 'cover', 'cqb'],
    builder: buildArcadeCabinet,
    footprint: [2.4, 2.2, 1.8]
  },
  pinball_bumper: {
    id: 'pinball_bumper',
    name: 'Kinetic Pop-Bumper Jump Pad',
    tags: ['arcade', 'retro_arcade', 'bumper', 'jump', 'pinball'],
    builder: buildPinballBumper,
    footprint: [1.8, 1.4, 1.8]
  },
  locomotive_boiler: {
    id: 'locomotive_boiler',
    name: 'Victorian Locomotive Boiler & Running Gear',
    tags: ['train_depot', 'depot', 'boiler', 'locomotive', 'landmark'],
    builder: buildLocomotiveBoiler,
    footprint: [4.2, 4.4, 14.0]
  },
  water_tower: {
    id: 'water_tower',
    name: 'Elevated Riveted Water Tank Tower',
    tags: ['train_depot', 'depot', 'tower', 'water', 'landmark', 'sniper'],
    builder: buildWaterTower,
    footprint: [8.0, 15.0, 8.0]
  },
  bunsen_burner: {
    id: 'bunsen_burner',
    name: 'Colossal Laboratory Bunsen Burner',
    tags: ['chemistry_lab', 'lab', 'burner', 'flame', 'landmark', 'grapple'],
    builder: buildBunsenBurner,
    footprint: [5.0, 14.0, 5.0]
  },
  pinball_machine: {
    id: 'pinball_machine',
    name: 'Monumental Tilted Pinball Machine Centerpiece',
    tags: ['arcade', 'retro_arcade', 'pinball', 'table', 'landmark', 'grapple'],
    builder: buildPinballMachine,
    footprint: [10.0, 14.0, 18.0]
  },
  hero_pinball_machine: {
    id: 'hero_pinball_machine',
    name: 'Colossal 16m Tilted Pinball Arena Centerpiece',
    tags: ['arcade', 'retro_arcade', 'pinball', 'table', 'landmark', 'hero'],
    builder: buildPinballMachine,
    footprint: [10.0, 14.0, 18.0]
  },
  neon_marquee: { id: 'neon_marquee', tags: ['arcade', 'retro_arcade', 'neon', 'sign'], builder: buildNeonMarquee },
  skee_ball_lane: { id: 'skee_ball_lane', tags: ['arcade', 'retro_arcade', 'skee_ball'], builder: buildSkeeBallLane },
  claw_machine: { id: 'claw_machine', tags: ['arcade', 'retro_arcade', 'claw_machine'], builder: buildClawMachine },
  air_hockey_table: { id: 'air_hockey_table', tags: ['arcade', 'retro_arcade', 'air_hockey'], builder: buildAirHockeyTable },
  prize_counter: { id: 'prize_counter', tags: ['arcade', 'retro_arcade', 'counter', 'prize'], builder: buildPrizeCounter },
  ticket_booth: { id: 'ticket_booth', tags: ['arcade', 'retro_arcade', 'ticket', 'booth'], builder: buildTicketBooth },
  arcade_carpet: { id: 'arcade_carpet', tags: ['arcade', 'retro_arcade', 'carpet', 'decal'], builder: buildArcadeCarpet },
  coin_op_wall: { id: 'coin_op_wall', tags: ['arcade', 'retro_arcade', 'coin', 'wall'], builder: buildCoinOpWall },
  ticket_chute: { id: 'ticket_chute', tags: ['arcade', 'retro_arcade', 'ticket', 'chute'], builder: buildTicketChute }
};

/**
 * Procedural Parametric Organic Tree Generator (Blueprint 2)
 * Kills the Static Clone Problem: generates Titan, Slender, or Gnarled trees
 * using continuous parameter spaces, da Vinci branch area preservation, and
 * rich tactical furniture (buttress root ramps, hollow trunk niche, canopy deck).
 */

/**
 * Curved Hollow Log Sprint Tunnel (Blueprint 2 & 3)
 * Multi-segment fallen log corridor with honest 1.8m/2.2m clearance bore,
 * exterior shelf-fungus spiral stairs, and elevated top catwalk with parapets.
 */

/**
 * Faceted Boulder Cover Field (Blueprint 2 & 4)
 * Places a tactical cluster of faceted sketched boulders providing
 * waist cover, full cover, and unobstructed movement channels.
 */

/**
 * Procedural Giant Stalk Grass with Apical Grapple Ring (Colossal Forest)
 * Radiating green blade clusters providing waist-high defilade at base,
 * with a monumental flexible central stalk crowned with an aerial momentum grapple ring.
 */

/**
 * Procedural Colossal Titan Treehouse (Colossal Forest Macro Landmark)
 * Monumental redwood trunk supporting a multi-level constructed wooden treehouse cabin,
 * spiral trunk staircase, wrap-around timber balcony with parapets, secondary escape route,
 * and high-altitude grapple highway rings (C1-C7 Colossal Contract compliant).
 */

/**
 * Registers a new prefab or declarative recipe dynamically into the registry.
 */
export function registerPrefab(id, builderFn, metadata = {}) {
  PREFAB_REGISTRY[id] = {
    id,
    name: metadata.name || id,
    tags: metadata.tags || ['recipe', 'taught'],
    builder: builderFn,
    footprint: metadata.footprint || [4.0, 4.0, 4.0],
    ...metadata
  };
  return PREFAB_REGISTRY[id];
}

/**
 * Compiles and instantiates a declarative compound prefab definition (parts array).
 */

/**
 * Instantiates any registered prefab by ID or thematic keyword.
 * Supports procedural builder functions and declarative compound prefab recipes.
 */
export function instantiatePrefab(B, prefabId, x, y, z, o = {}) {
  // Direct compound object pass { parts: [...] }
  if (typeof prefabId === 'object' && Array.isArray(prefabId.parts)) {
    return buildCompoundParts(B, prefabId.parts, x, y, z, o);
  }

  // Caller passed parts override in options
  if (Array.isArray(o.parts)) {
    return buildCompoundParts(B, o.parts, x, y, z, o);
  }

  let entry = PREFAB_REGISTRY[prefabId];
  if (!entry && typeof prefabId === 'string') {
    const norm = prefabId.toLowerCase().replace(/[^a-z0-9]/g, '_').replace(/_+/g, '_').replace(/^_|_$/g, '');
    entry = PREFAB_REGISTRY[norm];
    if (!entry) {
      // Find key or tag match
      for (const [k, v] of Object.entries(PREFAB_REGISTRY)) {
        if (norm.includes(k) || k.includes(norm) || (v.tags && v.tags.some(t => norm.includes(t)))) {
          entry = v;
          break;
        }
      }
    }
  }

  if (!entry) {
    // Ultimate graceful fallback: book_stack for urban/colossal or crate_stack
    entry = PREFAB_REGISTRY['crate_stack'] || PREFAB_REGISTRY['book_stack'];
    if (!entry) {
      console.warn(`[PREFAB] Unknown prefab ID "${prefabId}". Available:`, Object.keys(PREFAB_REGISTRY));
      return false;
    }
  }

  // Compound parts array on registered prefab
  if (Array.isArray(entry.parts)) {
    return buildCompoundParts(B, entry.parts, x, y, z, { ...entry.opts, ...o });
  }

  if (typeof entry.builder === 'function') {
    if (B && B.L) {
      if (!B.L.instantiatedPrefabs) B.L.instantiatedPrefabs = [];
      B.L.instantiatedPrefabs.push(entry);
    }
    entry.builder(B, x, y, z, o);
    return true;
  }

  console.warn(`[PREFAB] Registered prefab ID "${prefabId}" has neither builder function nor parts definition.`);
  return false;
}

export const buildGalleon = buildFullGalleon;



