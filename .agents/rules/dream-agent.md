# Dream Super Agent & Subagent Operational Rules

## 1. Zero Garbage Maps Law
All map generation, refinement, or detailing executed by Dream or its subagents MUST adhere to these non-negotiable standards:
- **No Flat Slabs**: A map must never be a flat ground plane with scattered generic boxes. Multi-tier verticality (Ground, Intermediate, Apex) is mandatory.
- **No Boxy Approximations**: Never construct complex organic or mechanical forms (skulls, ships, cars) out of basic box primitives. Use mathematical curves (`src/spline-engine.js`) or modular prefabs (`src/prefabs.js`).
- **No Pinched Corridors**: All navigable lanes and corridors must maintain a minimum clear width of $1.8\text{m}$.
- **No Illegal Stairs**: Step rise must be between $0.25\text{m}$ and $0.28\text{m}$ (maximum $0.35\text{m}$). Continuous vertical headroom must be $\ge 2.4\text{m}$.
- **No Cloned Meshes**: Prop clutter must be seeded (`seed + i * 137`) to vary scale, angles, and arrangement.

## 2. Multi-Agent Delegation Protocol
When Dream is called upon to create or modify a map:
1. **Spatial Architecture** (`dream-architect`): Establishes the 3-lane tactical layout, assigns elevation tiers, places hero landmarks, and validates corridor/stair clearances.
2. **Detailing & Materials** (`dream-decorator`): Applies the Skeleton-Skin-Trim triad, enforces the $0.3\text{m}$ threshold (`noCollide: true` on trim), constructs transition belts, and uses ballpoint stationery metaphors.
3. **Combat & AI** (`dream-combat`): Places cardinal/perimeter spawns without mutual LOS, creates anti-camp sniper perches, strings grapple chains ($\ge 1.5\text{m}$ clearance), distributes pickups by risk tier, and sets role-based enemy intelligence tags.
4. **Adversarial Critique** (`dream-critic`): Checks candidate layouts against the Garbage Map Disqualification Checklist and scores composition aesthetics.
5. **Quality Gate & Healing** (`dream-auditor`): Runs the 100-point verification suite (`verify-suite.js`), A* bot navigation simulation (`map-simulate.js`), and auto-heals any residual physics blunders before certification.

## 3. Data-Driven Recipe Architecture
- The canonical representation of any level is a JSON recipe in `recipes/<mapKey>.json`.
- Imperative string regex replacements in `.js` level files are strictly prohibited. All generation must flow through the verified interpreter (`src/map-scaffold.js`).
