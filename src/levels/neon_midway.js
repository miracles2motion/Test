import { buildMapFromRecipe } from '../map-recipe.js';

/**
 * Map: NEON MIDWAY (neon_midway)
 * Pure Declarative Recipe Implementation (Dream Master Architecture)
 * 100% Data-Driven, Biome-Adaptive, and Standard-Compliant.
 */
export const RECIPE = {
  "id": "neon_midway",
  "name": "Neon Midway",
  "version": 2,
  "seed": 87807,
  "scale": "standard",
  "bounds": {
    "half": 42,
    "wallH": 16,
    "arenaHalf": 55,
    "arenaWallH": 24
  },
  "palette": "cyber",
  "paper": {
    "tint": "#eef1f6",
    "rules": true,
    "lineSpacing": 50
  },
  "ground": {
    "ink": "BL",
    "clearing": {
      "r": 8.490349347237498,
      "ink": "GREEN"
    },
    "terraces": [
      {
        "x": -26,
        "z": -26,
        "rx": 10,
        "rz": 10,
        "y": 3.2,
        "ink": "OR",
        "stairDir": "+z",
        "stairW": 3
      },
      {
        "x": 26,
        "z": 26,
        "rx": 10,
        "rz": 10,
        "y": 3.354470493271947,
        "ink": "OR",
        "stairDir": "-z",
        "stairW": 3
      }
    ]
  },
  "water": {
    "ribbon": {
      "axis": "z",
      "x": 16,
      "from": -46,
      "to": 46,
      "width": 8,
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
        "type": "arched_bridge",
        "z": 1.7749409871175885
      },
      {
        "type": "stepping_stones",
        "z": -18
      }
    ]
  },
  "sectors": [
    {
      "id": "server_cluster",
      "name": "High-Density Server Bay",
      "shape": "disc",
      "c": [
        -25,
        -24
      ],
      "rIn": 8,
      "rOut": 14,
      "core": {
        "prefab": "arcade_cabinet",
        "opts": {
          "count": 18,
          "seed": 100
        }
      },
      "props": [
        {
          "prefab": "holo_pylon",
          "n": 3,
          "place": "inField"
        },
        {
          "prefab": "telemetry_console",
          "n": 2,
          "place": "inField"
        }
      ],
      "tint": {
        "ink": "OR",
        "rx": 11,
        "rz": 11
      },
      "reward": {
        "pickup": true
      }
    },
    {
      "id": "cooling_conduit",
      "name": "Cryogenic Heat Exchanger",
      "shape": "disc",
      "c": [
        26,
        -24
      ],
      "rIn": 8,
      "rOut": 14,
      "core": {
        "prefab": "cryo_pod",
        "opts": {
          "count": 18,
          "seed": 237
        }
      },
      "props": [
        {
          "prefab": "valve_bank",
          "n": 3,
          "place": "inField"
        },
        {
          "prefab": "pressure_gauge",
          "n": 2,
          "place": "inField"
        }
      ],
      "tint": {
        "ink": "BL",
        "rx": 11,
        "rz": 11
      },
      "reward": {
        "pickup": true
      }
    },
    {
      "id": "uplink_array",
      "name": "Satellite Uplink Matrix",
      "shape": "capsule",
      "c": [
        -25,
        24
      ],
      "a": [
        -26,
        12
      ],
      "b": [
        -26,
        34
      ],
      "rIn": 4,
      "rOut": 7,
      "core": {
        "prefab": "communications_dish",
        "opts": {
          "count": 18,
          "seed": 374
        }
      },
      "props": [
        {
          "prefab": "solar_array",
          "n": 3,
          "place": "inField"
        },
        {
          "prefab": "antenna_whip",
          "n": 2,
          "place": "inField"
        }
      ],
      "tint": {
        "ink": "OR",
        "rx": 11,
        "rz": 11
      },
      "reward": {
        "pickup": true
      }
    },
    {
      "id": "power_substation",
      "name": "Fusion Capacitor Bank",
      "shape": "disc",
      "c": [
        26,
        24
      ],
      "rIn": 8,
      "rOut": 14,
      "core": {
        "prefab": "pinball_bumper",
        "opts": {
          "count": 18,
          "seed": 511
        }
      },
      "props": [
        {
          "prefab": "warning_sign",
          "n": 3,
          "place": "inField"
        },
        {
          "prefab": "telemetry_console",
          "n": 2,
          "place": "inField"
        }
      ],
      "tint": {
        "ink": "BL",
        "rx": 11,
        "rz": 11
      },
      "reward": {
        "pickup": true
      }
    }
  ],
  "landmarks": [
    {
      "prefab": "space_frame_concourse",
      "at": [
        0,
        0,
        0
      ],
      "opts": {},
      "role": "hub",
      "beacon": true
    }
  ],
  "beltProps": [
    {
      "between": [
        "server_cluster",
        "cooling_conduit"
      ],
      "prefabs": [
        "holo_pylon",
        "telemetry_console",
        "warning_sign"
      ]
    },
    {
      "between": [
        "uplink_array",
        "power_substation"
      ],
      "prefabs": [
        "telemetry_console",
        "warning_sign",
        "antenna_whip"
      ]
    },
    {
      "between": [
        "server_cluster",
        "uplink_array"
      ],
      "prefabs": [
        "holo_pylon",
        "telemetry_console"
      ]
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
            44
          ],
          [
            0,
            32
          ],
          [
            2,
            20
          ],
          [
            0,
            10
          ]
        ]
      },
      {
        "from": "spawn:N",
        "to": "landmark:hub",
        "via": [
          [
            0,
            -44
          ],
          [
            0,
            -32
          ],
          [
            -2,
            -20
          ],
          [
            0,
            -10
          ]
        ]
      },
      {
        "from": "spawn:W",
        "to": "landmark:hub",
        "via": [
          [
            -44,
            0
          ],
          [
            -32,
            0
          ],
          [
            -18,
            0
          ],
          [
            -8,
            0
          ]
        ]
      },
      {
        "from": "spawn:E",
        "to": "landmark:hub",
        "via": [
          [
            44,
            0
          ],
          [
            32,
            0
          ],
          [
            18,
            0
          ],
          [
            8,
            0
          ]
        ]
      }
    ],
    "furniture": {
      "every": 14,
      "prefabs": [
        "holo_pylon",
        "telemetry_console"
      ]
    }
  },
  "vertical": {
    "tiers": [
      {
        "y": 0
      },
      {
        "y": 3.2,
        "kit": "tier1"
      },
      {
        "y": 6.5,
        "link": "decks"
      },
      {
        "y": 9.5
      }
    ],
    "grappleChains": [
      {
        "name": "hub_overlook",
        "from": [
          -14,
          15,
          -14
        ],
        "to": [
          14,
          15,
          14
        ]
      },
      {
        "name": "cross_chasm",
        "from": [
          0,
          16,
          -26
        ],
        "to": [
          0,
          16,
          26
        ]
      }
    ],
    "bouncePoints": [
      {
        "at": [
          -20,
          3.2,
          -20
        ],
        "to": "terrace:nw"
      },
      {
        "at": [
          20,
          3.2,
          20
        ],
        "to": "terrace:se"
      }
    ]
  },
  "spawns": {
    "cardinal": 4,
    "offset": 6
  },
  "snipers": {
    "deckY": 9.5,
    "cardinal": 4
  },
  "pickups": [
    {
      "at": [
        0,
        4.8,
        0
      ],
      "tier": "legendary"
    },
    {
      "at": [
        -26,
        0.4,
        26
      ],
      "tier": "health"
    },
    {
      "at": [
        26,
        0.4,
        -26
      ],
      "tier": "armor"
    },
    {
      "at": [
        -26,
        3.6,
        -26
      ],
      "tier": "ammo"
    },
    {
      "at": [
        26,
        3.6,
        26
      ],
      "tier": "ammo"
    }
  ],
  "actors": [
    "dust",
    "paper",
    "atmospheric_beams"
  ],
  "detail": {
    "litter": "inner30",
    "shadows": "blob:all",
    "beacons": true
  }
};

export function buildNeonMidway(B, arena = false) {
  const result = buildMapFromRecipe(B, RECIPE, arena);
  B.finish();
  return result.L;
}
