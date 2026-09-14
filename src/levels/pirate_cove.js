import { buildMapFromRecipe } from '../map-recipe.js';

/**
 * Map: PIRATE COVE (pirate_cove)
 * Pure Declarative Recipe Implementation (Dream Master Architecture)
 * 100% Data-Driven, Biome-Adaptive, and Standard-Compliant.
 */
export const RECIPE = {
  "id": "pirate_cove",
  "name": "Smuggler's Cutlass Cove",
  "version": 2,
  "seed": 3668,
  "scale": "colossal",
  "bounds": {
    "half": 55,
    "wallH": 20,
    "arenaHalf": 68,
    "arenaWallH": 30
  },
  "palette": "tropical",
  "paper": {
    "tint": "#f2ecd9",
    "rules": true,
    "lineSpacing": 50
  },
  "ground": {
    "ink": "OR",
    "clearing": {
      "r": 9,
      "ink": "GREEN"
    }
  },
  "water": {
    "ribbon": {
      "axis": "z",
      "x": 18,
      "from": -48,
      "to": 48,
      "width": 12,
      "sink": 0.05,
      "ink": "BLUE"
    },
    "banks": {
      "ink": "BLACK",
      "step": 6,
      "len": 7.2
    },
    "crossings": [
      {
        "type": "stepping_stones",
        "z": 0
      },
      {
        "type": "arched_bridge",
        "z": -18
      }
    ]
  },
  "sectors": [
    {
      "id": "docks",
      "shape": "disc",
      "c": [
        30,
        -20
      ],
      "rIn": 8,
      "rOut": 14,
      "props": [
        {
          "prefab": "fern_cluster",
          "n": 1
        }
      ],
      "tint": {
        "ink": "OR",
        "rx": 10,
        "rz": 10
      },
      "reward": {
        "pickup": true
      }
    },
    {
      "id": "whale_graveyard",
      "shape": "capsule",
      "a": [
        -22,
        -4
      ],
      "b": [
        -22,
        18
      ],
      "rIn": 4,
      "rOut": 8,
      "core": {
        "prefab": "creature_skeleton",
        "opts": {
          "length": 22,
          "ribPairs": 6,
          "seed": 55
        }
      },
      "tint": {
        "ink": "BLACK",
        "rx": 6,
        "rz": 12
      },
      "reward": {
        "pickup": true
      }
    }
  ],
  "landmarks": [
    {
      "prefab": "full_galleon",
      "at": [
        0,
        0,
        0
      ],
      "opts": {},
      "role": "hub",
      "beacon": true
    },
    {
      "prefab": "ancient_tree",
      "at": [
        -32,
        0,
        28
      ],
      "opts": {
        "h": 18,
        "r": 2.2
      },
      "role": "vantage"
    }
  ],
  "trails": {
    "ink": "OR",
    "width": 2.4,
    "routes": [
      {
        "from": "spawn:S",
        "to": "landmark:hub",
        "via": [
          [
            0,
            48
          ],
          [
            1.5,
            36
          ],
          [
            -2,
            24
          ],
          [
            0,
            10
          ],
          [
            0,
            0
          ]
        ]
      }
    ]
  },
  "perimeter": {
    "style": "palisade_wall"
  },
  "vertical": {
    "grappleChains": [
      {
        "name": "crows_nest",
        "from": [
          0,
          22,
          0
        ],
        "to": [
          0,
          30,
          0
        ]
      }
    ]
  },
  "snipers": [
    [
      0,
      26.8,
      12
    ],
    [
      0,
      30.8,
      2
    ],
    [
      -32,
      18,
      28
    ]
  ],
  "pickups": [
    {
      "at": [
        0,
        6,
        0
      ],
      "tier": "legendary"
    },
    {
      "at": [
        18,
        1.2,
        -18
      ],
      "tier": "health"
    },
    {
      "at": [
        0,
        8,
        12
      ],
      "tier": "ammo"
    },
    {
      "at": [
        30,
        0.4,
        -20
      ],
      "tier": "health"
    },
    {
      "at": [
        -32,
        0.4,
        28
      ],
      "tier": "armor"
    }
  ],
  "actors": [
    "birds"
  ]
};

export function buildPirateCove(B, arena = false) {
  const result = buildMapFromRecipe(B, RECIPE, arena);
  B.finish();
  return result.L;
}
