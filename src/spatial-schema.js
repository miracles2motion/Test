/**
 * Doodle Strike - Spatial JSON Schema v2
 * 
 * This is the exact JSON structure the LLM must output.
 * It serves as the universal interchange format between LLM creativity and Dream's geometric engine.
 */

export const SPATIAL_JSON_SCHEMA = {
  "$schema": "dream-spatial-v2",
  "metadata": {
    "mapName": "string",
    "theme": "enum: cyber_city | industrial | nature_ruin | alien_jungle | gothic_cathedral | maritime | zen",
    "biome": "string (optional, overrides theme for organic maps)",
    "playerCount": "number (2-16)",
    "gameMode": "enum: deathmatch | capture | search_destroy | king_of_hill",
    "verticalLayers": "number (1-6)",
    "aggressionProfile": "number 0.0-1.0",
    "description": "string (one sentence, for human reference only)"
  },
  
  "regions": [
    {
      "id": "string (unique, e.g., 'mid_arena', 'east_tower')",
      "type": "enum: arena | corridor | shaft | alcove | balcony | atrium | cave | platform",
      "bounds": {
        "center": ["x", "y", "z"],
        "size": ["width", "height", "depth"]
      },
      "elevation": "number (meters above ground)",
      "openness": "number 0.0-1.0 (0 = enclosed room, 1 = open sky)",
      "tags": ["string array (e.g., 'high-traffic', 'sniper-zone')"]
    }
  ],
  
  "connections": [
    {
      "from": "region_id",
      "to": "region_id",
      "type": "enum: doorway | ramp | staircase | grapple | jump_gap | zipline | open",
      "width": "number (meters)",
      "height": "number (meters)",
      "exposure": "number 0.0-1.0 (how exposed is this connection to enemy fire)",
      "bidirectional": "boolean"
    }
  ],
  
  "structures": [
    {
      "id": "string",
      "prefab": "string (existing prefab ID or 'SYNTHESIZE:type')",
      "synthesisRequest": {
        "type": "string (e.g., 'bridge', 'tower', 'ship_hull')",
        "params": { "key": "value" },
        "purpose": "string"
      },
      "position": ["x", "y", "z"],
      "rotation": ["rx", "ry", "rz"],
      "scale": ["sx", "sy", "sz"],
      "region": "region_id",
      "detailingTier": "number 0-4"
    }
  ],
  
  "gameplayElements": {
    "spawns": [
      {
        "team": "enum: A | B | neutral",
        "position": ["x", "y", "z"],
        "facing": ["dx", "dy", "dz"],
        "protection": "enum: full | partial | exposed"
      }
    ],
    "grapplePoints": [
      {
        "position": ["x", "y", "z"],
        "type": "enum: static | swing"
      }
    ],
    "coverNodes": [
      {
        "position": ["x", "y", "z"],
        "type": "enum: full | half | destructible",
        "facing": ["dx", "dy", "dz"]
      }
    ]
  },
  
  "terrain": {
    "type": "enum: flat | voxel | heightmap",
    "voxelOperations": [
      {
        "operation": "enum: hill | cave | ridge",
        "center": ["x", "y", "z"],
        "radius": "number"
      }
    ],
    "lsystemInstances": [
      {
        "grammar": "enum: TREE | CORAL | CRYSTAL | VINE",
        "position": ["x", "y", "z"],
        "scale": "number",
        "playable": "boolean"
      }
    ]
  }
};
