# DOODLE STRIKE — ENEMY INTELLIGENCE & BEHAVIORAL ARCHITECTURE SPECIFICATION (`enemy.md`)

> **Document Version**: 1.0 (Comprehensive Architecture & Behavioral Breakdown)  
> **Target Audience**: AI Researchers, Game AI Engineers, and Large Language Models evaluating or proposing upgrades for Doodle Strike's enemy system.  
> **Source Files Covered**:
> - `src/enemies.js` (Core enemy logic, physical state, animation, weapons, bosses)
> - `src/enemy-brain.js` (Adaptive learning engine, player profiling, squad coordinator)
> - `src/weapons.js` (Sound alerts, hit registration, player profile weapon telemetry)
> - `src/player.js` (Grenade telemetry, movement vector exposure)
> - `.agents/skills/enemy-intelligence-design/SKILL.md` (Design specifications & standard)

---

## TABLE OF CONTENTS
1. [System Overview & High-Level Architecture](#1-system-overview--high-level-architecture)
2. [Complete Enemy Taxonomy & Types Registry](#2-complete-enemy-taxonomy--types-registry)
3. [Enemy Entity Lifecycle & State Variables](#3-enemy-entity-lifecycle--state-variables)
4. [Locomotion, Physics & Spatial Navigation](#4-locomotion-physics--spatial-navigation)
5. [Perception, Sensory Systems & Memory](#5-perception-sensory-systems--memory)
6. [Combat Decision Trees & Tactical Systems](#6-combat-decision-trees--tactical-systems)
7. [Weapon Handlers & Projectile Ballistics](#7-weapon-handlers--projectile-ballistics)
8. [Boss Archetypes & Multi-Phase Boss AI](#8-boss-archetypes--multi-phase-boss-ai)
9. [Adaptive Learning Engine (`EnemyBrain`)](#9-adaptive-learning-engine-enemybrain)
10. [Squad Coordination & Pack Tactics](#10-squad-coordination--pack-tactics)
11. [Difficulty Progression Matrix (0 to 4)](#11-difficulty-progression-matrix-0-to-4)
12. [Hitboxes, Damage, Dismemberment & Ragdolls](#12-hitboxes-damage-dismemberment--ragdolls)
13. [Networking & Mirror Synchronization](#13-networking--mirror-synchronization)
14. [Identified Bottlenecks & Potential Upgrade Vectors](#14-identified-bottlenecks--potential-upgrade-vectors)

---

## 1. SYSTEM OVERVIEW & HIGH-LEVEL ARCHITECTURE

Doodle Strike uses a hybrid AI architecture composed of:
1. **A Micro-Tick Physics & Steering Controller**: Runs at 60Hz inside `update(dt)`, evaluating collision boundaries, stepping over curbs, jumping walls, and applying ground friction.
2. **A Role-Based Tactical State Machine**: Evaluates Line of Sight (LOS), distance intervals, health thresholds, and situational awareness (incoming grenades, player crosshairs, audible gunshots).
3. **An Online Statistical Profiling & Adaptation Engine (`EnemyBrain`)**: Continually models player habits (aggression vector, vertical air-time, favorite weapons, spatial heat maps) using Exponential Moving Averages (EMA), adjusting AI combat parameters in real time.
4. **A Multi-Agent Squad Coordinator (`SquadCoordinator`)**: Groups active combatants who share LOS to assign specialized squad roles (Heavy Suppressors vs. Distributed Flankers).

```
                      +-----------------------------+
                      |       PLAYER TELEMETRY      |
                      | Pos, Vel, Weapons, Grenades |
                      +--------------+--------------+
                                     |
                                     v
                       +---------------------------+
                       |    EnemyBrain (Profile)   |
                       |  EMA Learner (Rate 0..0.8)|
                       |  Disposition Classifier   |
                       +-------------+-------------+
                                     |
                      +--------------+--------------+
                      |                             |
                      v                             v
           +---------------------+       +---------------------+
           |  SquadCoordinator   |       |   Individual AI     |
           |  Suppressors/Flanks |       |   _think() Loop     |
           +----------+----------+       +----------+----------+
                      |                             |
                      +--------------+--------------+
                                     |
                                     v
                      +-----------------------------+
                      |   PHYSICS / STEER / WEAPONS |
                      | NavMesh A*, Raycast Cover,  |
                      | Lead Aim, Slide, Dissever   |
                      +-----------------------------+
```

---

## 2. COMPLETE ENEMY TAXONOMY & TYPES REGISTRY

All enemies are registered in `TYPES` within `src/enemies.js`. Every enemy contains core archetype tags followed by physical, combat, and scoring statistics:

### 2.1 Role-Based Intelligence Tags
- **`role`**: `'ranged'` | `'melee'` | `'kamikaze'` | `'aerial'` | `'boss'`. Governs the primary `_think()` branch.
- **`canDodge`** (`boolean`): Permits tactical ground slides when hit or when under player crosshair.
- **`canCover`** (`boolean`): Permits pathfinding into occluded cover nodes when wounded or reloading.
- **`canRetreat`** (`boolean`): Permits fleeing from combat when HP drops below critical thresholds.
- **`canFlank`** (`boolean`): Permits angular offset flanking maneuvers around the player.
- **`berserker`** (`boolean`, optional): When `true`, unit never retreats and ignores grenade alerts.
- **`stationary`** (`boolean`, optional): When `true`, unit roots in place while in effective firing range.

### 2.2 Complete Enemy Specifications

```javascript
TYPES = {
  // --- TIER 1: BASIC COMBATANTS ---
  grunt: {
    role: 'ranged',
    canDodge: true, canCover: true, canRetreat: true, canFlank: true,
    hp: 100, speed: 5.2, weapon: 'rifle',
    range: 28, stop: 16, keep: 7,
    burst: 3, burstInt: 0.15, cool: [1.6, 2.6], dmg: 6, spread: 0.055, pspeed: 36,
    score: 100, scale: 1.0, name: 'GRUNT', hat: 'cap',
    build: { bodyW: 1, headS: 1, limbR: 0.032 }
  },

  rusher: {
    role: 'melee',
    canDodge: true, canCover: true, canRetreat: false, canFlank: true,
    berserker: true,
    hp: 70, speed: 7.6, weapon: 'blade',
    lunge: 2.9, reach: 3.0, standoff: 1.9, cool: [1.0, 1.5], dmg: 15,
    score: 120, scale: 0.95, name: 'RUSHER', hat: 'band',
    build: { bodyW: 0.82, headS: 0.95, limbR: 0.027 }
  },

  heavy: {
    role: 'ranged',
    canDodge: false, canCover: true, canRetreat: true, canFlank: true,
    hp: 320, speed: 3.0, weapon: 'shotgun',
    range: 18, stop: 9, keep: 5,
    pellets: 7, cool: [2.4, 3.2], dmg: 5, spread: 0.13, pspeed: 32,
    score: 260, scale: 1.25, name: 'HEAVY', hat: 'helmet',
    build: { bodyW: 1.55, headS: 0.88, limbR: 0.05 }
  },

  sniper: {
    role: 'ranged',
    canDodge: true, canCover: true, canRetreat: true, canFlank: false,
    stationary: true,
    hp: 60, speed: 3.6, weapon: 'sniper',
    range: 90, stop: 90, keep: 15,
    aimTime: 1.7, cool: [2.8, 3.8], dmg: 22, spread: 0.006, pspeed: 95,
    score: 180, scale: 1.05, name: 'SNIPER', hat: 'hood',
    build: { bodyW: 0.78, headS: 0.92, limbR: 0.026 }
  },

  shield: {
    role: 'ranged',
    canDodge: false, canCover: true, canRetreat: true, canFlank: true,
    hp: 150, speed: 3.8, weapon: 'pistol',
    range: 20, stop: 8, keep: 4,
    burst: 2, burstInt: 0.2, cool: [1.8, 2.6], dmg: 5, spread: 0.06, pspeed: 34,
    score: 200, scale: 1.05, name: 'SHIELDBEARER', hat: 'helmet', shield: true,
    build: { bodyW: 1.2, headS: 0.9, limbR: 0.042 }
  },

  bomber: {
    role: 'kamikaze',
    canDodge: false, canCover: false, canRetreat: false, canFlank: false,
    hp: 26, speed: 6.5, weapon: 'bomb',
    fuseRange: 3.4, fuse: 1.05, blast: 4.2, dmg: 24,
    score: 150, scale: 0.9, name: 'INK BOMB', ink: INK.BLACK, model: 'bomber'
  },

  flyer: {
    role: 'aerial',
    canDodge: false, canCover: false, canRetreat: false, canFlank: false,
    flying: true,
    hp: 40, speed: 6.2, weapon: 'dive', dmg: 10, cool: [2.8, 4.2],
    score: 140, scale: 1.5, name: 'PAPER WASP', model: 'flyer'
  },

  // --- TIER 2: BOSS COMBATANTS ---
  boss: {
    role: 'boss',
    canDodge: false, canCover: false, canRetreat: false, canFlank: false,
    boss: true, bossKind: 'doodler',
    hp: 2600, speed: 3.2, weapon: 'boss',
    range: 32, stop: 6, keep: 0, cool: [2.6, 3.6], dmg: 22,
    score: 2500, scale: 2.7, name: 'THE DOODLER', hat: 'crown', ink: INK.BLACK,
    build: { bodyW: 1.35, headS: 1.15, limbR: 0.06 }
  },

  eraser: {
    role: 'boss',
    canDodge: false, canCover: false, canRetreat: false, canFlank: false,
    boss: true, bossKind: 'eraser',
    hp: 3400, speed: 4.2, weapon: 'boss',
    range: 30, stop: 8, keep: 0, cool: [2.2, 3.2], dmg: 26,
    score: 3200, scale: 2.6, name: 'THE ERASER', ink: INK.PINK, model: 'blob', build: {}
  },

  inkblot: {
    role: 'boss',
    canDodge: false, canCover: false, canRetreat: false, canFlank: false,
    boss: true, bossKind: 'inkblot',
    hp: 3000, speed: 3.0, weapon: 'boss',
    range: 34, stop: 10, keep: 0, cool: [2.4, 3.4], dmg: 20,
    score: 3600, scale: 2.4, name: 'THE INKBLOT', ink: INK.BLACK, model: 'blob', build: {}
  }
};
```

---

## 3. ENEMY ENTITY LIFECYCLE & STATE VARIABLES

Every enemy is created in `Enemies.spawn(type, pos, id)` as a single plain JavaScript object `e`. Understanding all variables on `e` is essential for modifying behaviors:

### 3.1 Entity Properties Matrix

| Variable | Type | Initial Value | Purpose / Lifecycle |
|---|---|---|---|
| `id` | `number` | Auto-increment | Unique identifier used for lookups and squad sets |
| `type` | `string` | e.g. `'grunt'` | Key mapping to `TYPES[type]` |
| `T` | `object` | Reference | Direct pointer to `TYPES[type]` definition |
| `hp` / `maxHp` | `number` | `T.hp` | Current and maximum health |
| `alive` | `boolean` | `true` | Alive flag; set false in `kill()` |
| `state` | `string` | `'spawn'` | State machine: `'spawn'` (0.6s intro), `'hunt'`, `'stunned'`, `'dead'` |
| `t` | `number` | `0` | Total lifetime accumulator in seconds |
| `body` | `Body` | `makeBody(...)` | Physics representation (half-width, height, step-height, velocity, pos) |
| `center` | `Vector3`| Torso pos | Recomputed world-space center point for LOS and hit detection |
| `yaw` / `yawT` | `number` | Radian angle | Current heading (`yaw`) and target heading (`yawT`), smoothed via `angleLerp` |
| `phase` | `number` | `rand(0, TAU)` | Animation phase accumulator for walking, wing flaps, and limb oscillation |
| `walk` | `number` | `0` | Damped walk cycle intensity `[0..1]` based on lateral speed |
| `aimAmt` | `number` | `0` | Damped aiming pose blend weight `[0..1]` |
| `flinch` | `number` | `0` | Damage reaction impulse, damped back to 0 at rate 9.0/s |
| `flashT` / `flashOn`| `number`/`bool`| `0`/`false` | Hit flash white ink shader duration |
| `path` | `Array` | `null` | Array of NavMesh path nodes from `findPath()` |
| `pathI` | `number` | `0` | Current active waypoint index in `path` |
| `pathT` | `number` | `0` | Timer until next A* NavMesh repath evaluation |
| `pathGoal` | `Vector3`| `null` | Target coordinates when current path was generated |
| `los` / `losT` | `bool`/`num` | `false`/`0` | Boolean Line of Sight cache and LOS countdown timer |
| `cool` | `number` | `rand(0.6, 1.4)`| Attack cooldown timer; decrements to zero before firing |
| `burstLeft` | `number` | `0` | Remaining rounds in current multi-shot burst |
| `burstT` | `number` | `0` | Interval countdown between burst bullets |
| `aimT` | `number` | `0` | Telegraph/aiming charge duration (critical for Sniper laser) |
| `attackT` | `number` | `0` | Melee swing action duration countdown |
| `attackHit` | `boolean` | `false` | True if melee frame already triggered damage in current swing |
| `stunDur` | `number` | `0` | Stun duration timer when parried, yanked, or staggered |
| `stuckT` | `number` | `0` | Continuous wall collision accumulator; triggers jump escape at 0.9s |
| `strafeDir` | `number` | `1` or `-1` | Lateral strafing direction modifier (swaps periodically) |
| `strafeT` | `number` | `rand(1, 2)` | Timer until next strafe direction reversal |
| `appAng` | `number` | Golden ratio slot | Individual radial angle around player target |
| `appR` | `number` | `rand(2, 9)` | Standoff radius around player slot |
| `appT` | `number` | `rand(0, 2)` | Radial slot reassignment timer |
| `keepMul` | `number` | `rand(0.75, 1.35)`| Personality spacing scalar applied to `keep` and `stop` ranges |
| `backoffT` | `number` | `0` | Post-melee retreat timer to avoid clipping into player |
| `fuseT` | `number` | `-1` | Kamikaze fuse timer (-1 = unlit, >0 = sizzling) |
| `shieldHp` | `number` | `2` or `0` | Hit points of physical riot shield before it breaks |
| `flyState` | `string` | `'orbit'` | Aerial state: `'orbit'`, `'dive'`, `'climb'`, or `'stunned'` |
| `flyT` | `number` | `rand(0, 3)` | Aerial state duration timer |
| `bossAtk` | `object` | `null` | Active boss attack state object `{ kind, t, done, ... }` |
| `justHit` | `boolean` | `false` | Set true in `damage()`, consumed in `_think()` for dodge triggering |
| `coverPoint` | `Vector3`| `null` | World position of safe cover waypoint |
| `coverT` | `number` | `0` | Duration to crouch behind cover |
| `retreating` | `boolean` | `false` | True if currently sprinting away to safety |
| `lastKnownPos` | `Vector3`| `null` | Coordinates where player was last observed before losing LOS |
| `panicT` | `number` | `0` | Freeze duration on Stupid difficulty (mode 0) |
| `hasPanicked` | `boolean` | `false` | Prevents infinite panic loops on mode 0 |
| `dodgeCooldown`| `number` | `0` | Cooldown preventing perpetual dodge spamming |
| `soundAlert` | `Vector3`| `null` | Coordinates of heard player gunshot (God Mode) |
| `flankAngle` | `number` | `±π/2` | Angular offset applied to approach vector on God Mode |
| `coordReady` | `boolean` | `false` | Reserved for multi-unit synchronized push commands |

---

## 4. LOCOMOTION, PHYSICS & SPATIAL NAVIGATION

### 4.1 Physics Body (`makeBody`)
- **Dimensions**:
  - Humanoids: Half-width = `Math.min(0.33 * scale, 0.9)`, Height = `1.85 * scale`, Step-Height = `0.6m`.
  - Bosses: Half-width = `0.7m`, Height = `3.4m`, Step-Height = `1.35m`.
  - Flyers: Half-width = `0.45m`, Height = `0.8m`, `noSnap: true` (ignores gravity).
- **Stepping & Gravity**:
  - `alwaysStep: true`: Auto-climbs curbs, staircases, and books up to the step height without losing velocity.
  - Gravity: Constantly pulls ground units down at `24.0 m/s²`.
  - Void kill: Falling below `y = -6.0` causes instant death (`source: 'fall'`).

### 4.2 Hole & Ledge Avoidance (`_groundAhead`)
Before moving or dodging sideways, ground-based units cast a 3.5m downward ray at offset `(pos.x + dx*0.9, pos.y + 0.5, pos.z + dz*0.9)`.
- If no floor is detected, the direction is rejected to prevent falling into pits.
- **Stupid Mode Flaw**: Enemies in Difficulty 0 have a `20% * wave` chance to completely ignore holes and plummet off ledges.

### 4.3 Slot-Based Approach Rings (`_approachPoint`)
To prevent enemies from stacking in a single file line ("conga-lining"), each unit is assigned a radial slot around the player:
- Slots drift every 2.5–5 seconds (`appAng += rand(-0.7, 0.7)`).
- Standoff radius: 2.0–4.5m for melee, 4.5–9.0m for ranged.
- Stairway awareness: If elevation difference `|dy| > 1.5m`, slot offset collapses to `1.1m` to prevent walking off narrow catwalks or stairs.

### 4.4 NavMesh A* Pathfinding (`_follow`)
- Re-evaluates paths when stale (every 0.8–1.4s or if target moves >3.5m).
- Automatically skips path nodes already within 0.7m lateral and 1.0m vertical clearance.
- **Jump Over Hurdles**: If waypoint is `>0.6m` above ground within 1.7m lateral, the unit injects vertical velocity `vel.y = 6.2m/s`.
- **Anti-Stuck Watchdog**: If `body.hitWall` persists for `>0.35s`, it forces a path repath; at `>0.9s`, it performs an un-stuck jump (`vel.y = 5.0m/s`).

### 4.5 Separation & Anti-Stacking Physics
- **Unit-to-Unit (`_separate`)**: Evaluated at 20Hz. If two enemies penetrate within `halfW_A + halfW_B + 0.75m`, an inverse-distance repulsive push force (`push = (rr - d) * 9`) separates them.
- **Player-to-Enemy**: If enemy penetrates within `0.48m + halfW` of player center, an immediate geometric displacement pushes the enemy out.

---

## 5. PERCEPTION, SENSORY SYSTEMS & MEMORY

### 5.1 Line of Sight (LOS) Raycasting
- Line of sight is evaluated from the enemy's eye (`matrixWorld` of `parts.head`) to the player's center (`pc`).
- Casts through the world physics hierarchy ignoring geometry tagged `SEE_THROUGH` (such as glass, drafting grids, or railings).
- **Reaction Refresh Rate (`e.losT`)**:
  - Difficulty 0 (Stupid): Checked every 0.35–0.43 seconds.
  - Difficulty 2 (Hard): Checked every 0.12–0.20 seconds (accelerates with waves).
  - Difficulty 4 (God Mode): Checked every 0.02–0.04 seconds (near instantaneous).

### 5.2 Sensory Memory (`lastKnownPos`)
- When LOS is lost, the AI preserves the player's last seen coordinate.
- The unit continues navigating toward `lastKnownPos` at elevated speed (`speed * 1.1`).
- Upon reaching within 2.5m of `lastKnownPos` without reacquiring visual contact, the memory expires, and the enemy drops back into baseline sweep patrol.

### 5.3 Auditory Hunting (`soundAlert`)
- Firing an unsuppressed weapon broadcasts an audio event to the enemy manager.
- On Difficulty 4 (God Mode), all living enemies with line of hearing (or within 40m radius) store the firing origin in `e.soundAlert`.
- Enemies actively steer toward the gunshot position to investigate and converge.

### 5.4 Crosshair Target Awareness (Aim Detection)
- Enemies track whether the player's camera forward vector is aimed directly at them:
  $$\vec{V}_{\text{cam}} \cdot \frac{\vec{P}_{\text{enemy}} - \vec{P}_{\text{cam}}}{\|\vec{P}_{\text{enemy}} - \vec{P}_{\text{cam}}\|} > 0.985$$
- If true and distance $<35\text{m}$, the enemy registers that it is locked in the player's crosshairs and triggers defensive combat slides on Hard, Extreme, and God Mode.

---

## 6. COMBAT DECISION TREES & TACTICAL SYSTEMS

```
                               +-------------------+
                               |  Is Player Alive? |
                               +---------+---------+
                                         |
                       +-----------------+-----------------+
                       | Yes                               | No
                       v                                   v
             +-------------------+                 +---------------+
             |   _think(e, dt)   |                 |   _wander()   |
             +---------+---------+                 +---------------+
                       |
        +--------------+--------------+
        |                             |
        v                             v
[Aerial Archetype]           [Ground Archetype]
_thinkFlyer()                Evaluate Status
                             - Panic? (Diff 0)
                             - Incoming Grenade? (Diff 3+)
                             - Crosshair lock / Damage? -> _combatSlide()
                             - Critical HP / Reload? -> _findCover()
                                       |
                       +---------------+---------------+
                       |                               |
                       v                               v
                [Cover Active]                 [In Combat Range]
               _retreatToCover()              - Strafe & Spacing
                                              - Lead Aim Target
                                              - Friendly Fire Check
                                              - Fire / Burst / Lunge
```

### 6.1 Tactical Combat Slides (`_combatSlide`)
- **Trigger**: When hit (`justHit === true`) or when the player's crosshair locks onto the enemy (`playerAimingAtMe`).
- **Mechanics**: Computes perpendicular vector to the player:
  $$\vec{P}_{\perp} = \left(-\frac{dz}{\text{dist}}, 0, \frac{dx}{\text{dist}}\right)$$
- Checks `_groundAhead` to ensure the slide won't fling the unit into empty space.
- Injects lateral impulse: `9.5 m/s` (Extreme) or `12.0 m/s` (God Mode).
- Vertical clearance: Clamps `vel.y` to a low-profile slide `0.4 m/s`, actively suppressing unwanted vertical rocket leaps.
- Cooldown: 1.2–1.7s on God Mode, 2.0–2.8s on Extreme, 3.0–4.2s on Hard.

### 6.2 Cover System & Tactical Retreat (`_findCover` & `_retreatToCover`)
- **Dual-Pass Cover Search**:
  1. **NavMesh Node Occlusion**: Searches up to 14 cells in the navigation grid. Identifies nodes between 3.5m and 18m away from enemy, but at least 7.0m away from the player, where world LOS to player is blocked. Scores nodes based on distance to enemy minus player proximity.
  2. **12-Ray Cast Fallback**: Casts 12 rays in a radial circle looking for solid obstacles with normals that block the player's view.
- **Retreat Activation**:
  - Triggered on Diff $\ge 2$ when $\frac{\text{HP}}{\text{MaxHP}} < 0.22$ (God Mode) or $< 0.40$ (Extreme/Hard).
  - Tactical Reload Cover (Diff 3): If cooldown $>0.8\text{s}$ and distance $>14\text{m}$, ranged units duck behind cover while cycling ammo.
  - Sprints to cover at `speed * 1.35`. Upon arrival, crouches, dampens velocity to 0, and holds for 2.0–3.5s or until cooldown expires.

### 6.3 Grenade Evasion
- Active on Difficulty $\ge 3$ for all non-berserkers.
- Scans `player.nades` for active fuses within 6.0m horizontal and 3.5m vertical radius.
- Injects emergency escape steering directly away from the grenade at `speed * 1.5` with 50 acceleration, breaking aim lock.

### 6.4 Friendly Fire Avoidance Raycasting
- On Difficulty $\ge 2$, before pulling the trigger, ranged enemies cast a ray from weapon muzzle to player center.
- If an allied enemy's hitbox intersects the firing line (`hitAlly !== null`), the shot is suppressed until the ally clears the line of fire.

---

## 7. WEAPON HANDLERS & PROJECTILE BALLISTICS

### 7.1 Intelligent Projectile Lead Math (`_fireOne`)
On Difficulty $\ge 2$, enemies compute a flight-time intercept vector based on the player's velocity:
$$t_{\text{flight}} = \frac{\|\vec{P}_{\text{target}} - \vec{P}_{\text{muzzle}}\|}{\max(v_{\text{projectile}}, 10)}$$
$$\vec{P}_{\text{lead}} = \vec{P}_{\text{target}} + \left(\vec{V}_{\text{player}} \cdot t_{\text{flight}} \cdot K_{\text{accuracy}}\right)$$

Where $K_{\text{accuracy}}$ is:
- **0.35** on Hard (Difficulty 2)
- **0.65** on Extreme (Difficulty 3)
- **0.92** on God Mode (Difficulty 4) — leading to near-laser tracking against running targets.
- In God Mode, projectile velocities also scale by an additional **1.25×**, and bullet spread narrows by **25%**.

### 7.2 Sniper Rifle & Telegraph Laser (`_showLaser`)
- High-damage single-shot weapon ($22\text{ base dmg}$, speed $95\text{ m/s}$).
- While aiming (`aimT < targetAimTime`), draws a visible red laser cylinder telegraph connecting muzzle to an aim point.
- The aim point smoothly chases the player (`lerp(pc, 1 - exp(-2.6 * dt))`) rather than sticking instantaneously, allowing the player to outrun the beam with fast movement.
- At 50% charge, broadcasts an audio telegraph warning (`audio.sniperAim()`).
- Laser stops short by 1.6m of the target point to prevent giant telegraph slabs covering the camera viewport.

### 7.3 Shotgun & Assault Rifle Bursts
- **Heavy Shotgun**: Fires 7 pellets simultaneously with randomized speed ($0.85-1.1 \times v$), wide spread ($0.13$), and muzzle flash bursts.
- **Rifle Burst**: Fires sequential rounds at intervals of `burstInt` (0.15s), dampening weapon spread on each burst.

### 7.4 Melee Combat (Blade / Rusher)
- Distance checks: Lunge trigger at $2.9\text{m}$, blade reach $3.0\text{m}$, standoff $1.9\text{m}$.
- On attack, unit enters a $0.55\text{s}$ attack sequence:
  - Windup: Arm draws up and backward.
  - Forward dash: Velocity impulse `+4.5 m/s` (God Mode) or `+2.5 m/s` (Standard).
  - Strike: Swings through an arc of 5 red ink tracers.
  - **Parry / Counter-Stun Window**: If player executes `tryBlockMelee()`, the enemy enters `'stunned'` state for $1.1\text{s}$ and is knocked backward (`vel.y = 3.5`, lateral knockback $7\text{ m/s}$).
  - Post-attack backoff: Unit retreats backward for 0.15–0.75s to prevent clipping inside the player.

### 7.5 Aerial Drone / Paper Wasp (`_thinkFlyer`)
- Completely independent 3D flight engine without gravity.
- **State 1: Orbit (`'orbit'`)**:
  - Circles the player at 11m radius and $y = \text{player.y} + 6.0\text{m} + \sin(1.3t)\cdot 1.5\text{m}$.
  - Plays subtle buzzing audio loops.
- **State 2: Dive (`'dive'`)**:
  - Accelerates directly toward player center at $16\text{ m/s}$ ($28\text{ accel}$).
  - If within 1.4m, delivers 10 damage and knockback, or stuns itself if parried.
- **State 3: Climb (`'climb'`)**:
  - Pulls upward to $y = \text{player.y} + 8\text{m}$ to reset orbit.
- **Obstacle Avoidance**: Casts forward rays; injects normal reflection velocities (`vel += normal * 14 * dt`) and upward lift to avoid slamming into walls or ground.

---

## 8. BOSS ARCHETYPES & MULTI-PHASE BOSS AI

All bosses have `role: 'boss'`, `canDodge: false`, `canCover: false`, and are immune to yank grapple forces. They smash through breakable environmental props in their path via bounding checks.

### 8.1 The Doodler (Standard Colossus)
- Giant humanoid stick figure (scale 2.7, HP 2600) carrying a massive orange ink pen with pink eraser pommel.
- **Attacks**:
  1. **Pen Stomp (`'stomp'`)**: Winds up for 0.75s, then slams the ground. Generates a screen-shaking shockwave, a 7m radial explosion, 24 directional ink strokes, and 22 damage + 9 knockback to any grounded player.
  2. **Ink Throw (`'throw'`)**: Fires a massive ink projectile (radius 0.4m, speed 24 m/s) from its head at the player.
  3. **Titanic Leap Slam**: If the player camps or stays further than 12m away on Hard+, the Doodler launches into the air with $16\text{ m/s}$ lateral velocity and $8.5\text{ m/s}$ upward velocity, landing with a ground-shaking shockwave.

### 8.2 The Eraser (Pink Rubber Juggernaut)
- Heavy rubber block boss (HP 3400, speed 4.2).
- **Attacks**:
  1. **High-Speed Bulldozer Charge (`'charge'`)**: Winds up for 0.7s, then charges at $17\text{ m/s}$. In God Mode, it features **dynamic vector steering**, continuously steering into the player's path (`lerp(dt * 4.5)`). Smashes into walls with explosive ink sparks.
  2. **Page Rubdown (`'rub'`)**: Every 3rd charge cycle, scrubs the paper page, emitting a 6m shockwave and summoning 2 kamikaze Ink Bombers into the battle.

### 8.3 The Inkblot (Amorphous Swarm Lord)
- Spiky black ink ball (HP 3000, speed 3.0).
- **Movement**: Never walks; moves exclusively by hopping. Jumps every 1.6–2.4s ($11\text{ m/s}$ forward, $13\text{ m/s}$ vertical), creating ink pools and damage shockwaves upon each landing.
- **Attacks**:
  1. **Ink Spray Fan (`'spray'`)**: Fires a rapid 9-shot fan of ink projectiles spanning a wide angular cone.
  2. **Swarm Summon (`'summon'`)**: Roars and shakes loose 3 Paper Wasp flyers from its ink mass (maintains up to 6 flyers simultaneously).

---

## 9. ADAPTIVE LEARNING ENGINE (`EnemyBrain`)

The adaptive learning engine (`src/enemy-brain.js`) dynamically analyzes player behavior and counters it by altering enemy movement and combat parameters.

```
       +-----------------------------------------------------------+
       |                   PLAYER METRIC INGESTION                 |
       |  Speed -> Mobility                                       |
       |  Airborne/Grapple -> Verticality                          |
       |  Toward-Vector Dot -> Aggression                          |
       |  Hit Ratio -> Accuracy                                    |
       |  Weapon Switch -> Weapon Profile Vector                   |
       |  Player Coordinates -> 8x8 Spatial Kill Heatmap           |
       +-----------------------------+-----------------------------+
                                     |
                                     v
       +-----------------------------------------------------------+
       |               EMA EXPONENTIAL SMOOTHING                   |
       |      val = damp(val, target, learningRate, dt)            |
       |      learningRate: 0.0 (Stupid) to 0.80 (God Mode)        |
       +-----------------------------+-----------------------------+
                                     |
                                     v
       +-----------------------------------------------------------+
       |                 DISPOSITION CLASSIFICATION                |
       |  aggression < 0.25 & mobility < 0.3  -> 'flush'           |
       |  aggression > 0.75 & mobility > 0.7  -> 'ambush'          |
       |  verticality > 0.6                   -> 'anti-air'        |
       |  sniper > 0.4                        -> 'gap-close'       |
       |  shotgun > 0.4                       -> 'kite'            |
       |  katana > 0.4                        -> 'spacing'         |
       +-----------------------------+-----------------------------+
                                     |
                                     v
       +-----------------------------------------------------------+
       |                     TACTICAL OVERRIDES                    |
       |  keepMulBias (0.2 - 2.0x spacing distance)                |
       |  dodgeChanceMul (0.5 - 2.0x evasion rate)                 |
       |  strafeDirOverride (force forward rush vs circling)       |
       |  suppress (suppressive fire bursts)                       |
       +-----------------------------------------------------------+
```

### 9.1 Player Profiling Metrics (`PlayerProfile`)

| Metric | Range | Description & Measurement |
|---|---|---|
| `mobility` | `0.0 .. 1.0` | Damped average of player speed normalized by $15.0\text{ m/s}$ |
| `verticality`| `0.0 .. 1.0` | Ratio of time spent airborne or using grapple hook |
| `aggression` | `0.0 .. 1.0` | Dot product alignment of player velocity toward living enemies |
| `accuracy` | `0.0 .. 1.0` | Running ratio of hits over shots fired |
| `weaponUsage`| `{rifle, shotgun, sniper, katana}` | Normalized frequency distribution of weapons used |
| `heatMap` | `Float32Array(64)` | 8x8 spatial grid over $[-60, 60]\text{m}$ tracking player camping zones and death origins |
| `dodgeBias` | `-1.0 .. +1.0` | Directional bias of player's strafing relative to their right vector |
| `nadesThrown`| Integer | Total grenades thrown by player |

### 9.2 Learning Rates Across Difficulties
```javascript
this.learningRate = 
  diff === 0 ? 0.00 : // Stupid: Zero learning
  diff === 1 ? 0.05 : // Easy: Very slow adaptation
  diff === 2 ? 0.15 : // Hard: Moderate adaptation over waves
  diff === 3 ? 0.35 : // Extreme: Sharp tactical counter-play
               0.80;  // God Mode: Instant adaptation, unfair prediction
```

### 9.3 Tactical Dispositions & Behavioral Overrides

When dispositions trigger, `consult(e, dist, los)` modifies enemy parameters:

1. **`flush` (Camper Counter)**:
   - Condition: `aggression < 0.25 && mobility < 0.3`
   - Overrides: `keepMulBias = 0.4`, `strafeDirOverride = 0` (charge straight forward), `dodgeChanceMul = 0.5`.
   - Result: Enemies stop circling and aggressively breach the camper's position.
2. **`ambush` (Rusher Counter)**:
   - Condition: `aggression > 0.75 && mobility > 0.7`
   - Overrides: `keepMulBias = 1.5`, `dodgeChanceMul = 1.5`.
   - Result: Enemies backpedal to preserve distance and increase defensive dodge frequency.
3. **`gap-close` (Sniper Counter)**:
   - Condition: `weaponUsage.sniper > 0.4`
   - Overrides: `keepMulBias = 0.2`, `dodgeChanceMul = 2.0`.
   - Result: Enemies sprint into point-blank range while slide-dodging to deny long-range sightlines.
4. **`kite` / `spacing` (Shotgun & Katana Counter)**:
   - Condition: `weaponUsage.shotgun > 0.4 || weaponUsage.katana > 0.4`
   - Overrides: `keepMulBias = 2.0`.
   - Result: Enemies double their standoff distance, refusing to enter melee or shotgun blast radius.
5. **`anti-air` (Grapple / Jumper Counter)**:
   - Condition: `verticality > 0.6`
   - Result: Prioritizes vertical lead aiming and intercepts aerial flight trajectories.

### 9.4 Cross-Session God Mode Persistence
In God Mode (Difficulty 4), the `PlayerProfile` is serialized to JSON and stored in `localStorage['doodle_brain']`. If a player restarts the game or reloads the page, enemies **already know their playstyle** from frame 1.

---

## 10. SQUAD COORDINATION & PACK TACTICS

On Difficulty 3 (Extreme) and 4 (God Mode), the `SquadCoordinator` orchestrates group behavior for all living enemies with line of sight:

### 10.1 Dedicated Suppressors
- When 3 or more non-boss ground units share LOS to the player, the system designates the enemy furthest in the back as the **Suppressor**.
- **Suppressor Overrides**:
  - `burstLeft`: Increased by $+2$ rounds.
  - `burstInt`: Reduced to $0.7\times$ (faster rate of fire).
  - `cool`: Reduced to $0.2-0.6\text{s}$ (continuous firing cycle).
  - Sniper Suppressors: Aim time reduced to $0.7\times$, cooldown reduced to $0.5-1.0\text{s}$.

### 10.2 Coordinated Flanking Encirclement
- Units tagged with `canFlank: true` are dynamically assigned complementary approach angles:
  $$\text{flankAngle} = (-1)^i \cdot \left(\lfloor i / 2 \rfloor + 1\right) \cdot \frac{\pi}{4}$$
  *(Assigning angles: $+45^\circ, -45^\circ, +90^\circ, -90^\circ, +135^\circ, -135^\circ$)*
- On God Mode, flanking units navigate toward:
  $$\vec{P}_{\text{flank}} = \vec{P}_{\text{player}} - \vec{V}_{\text{player\_fwd}} \cdot 8.0 \quad \text{rotated by } \text{flankAngle}$$
- This forces enemies to surround and back-stab the player rather than advancing from the front.

---

## 11. DIFFICULTY PROGRESSION MATRIX (0 TO 4)

| Feature / Behavior | Mode 0 (STUPID) | Mode 1 (EASY) | Mode 2 (HARD) | Mode 3 (EXTREME) | Mode 4 (GOD MODE) |
|---|---|---|---|---|---|
| **Damage Multiplier** | 0.6× | 0.85× | 1.0× | 1.25× | 1.5× |
| **Speed Multiplier** | 0.75× | 0.9× | 1.0× | 1.1× | 1.25× |
| **Reaction Latency** | 0.35–0.43s | 0.18–0.26s | 0.12–0.20s | 0.08–0.16s | 0.02–0.04s |
| **Panic Freeze** | ✅ (1–2s freeze) | ❌ | ❌ | ❌ | ❌ |
| **Hole Neglect Risk** | 20% × Wave | ❌ | ❌ | ❌ | ❌ |
| **Friendly Fire Avoidance** | ❌ (Shoots allies) | ❌ | ✅ | ✅ | ✅ |
| **Tactical Combat Slide** | ❌ | ❌ | On hit only | On hit + Aim lock | Near-constant (12m/s) |
| **Bullet Lead Intercept** | 0% | 0% | 35% | 65% | 92% (Flight-time lead) |
| **Tactical Cover Retreat**| ❌ | ❌ | At <40% HP | <40% HP + Reloads | Relentless (<22% HP) |
| **Grenade Awareness** | ❌ | ❌ | ❌ | ✅ (6m sprint away)| ✅ (Fast evasion) |
| **Gunshot Sound Hunting**| ❌ | ❌ | ❌ | ❌ | ✅ (Converge on sound)|
| **Squad Pack Coordination**| ❌ | ❌ | ❌ | Suppressors only | Suppressors + Flankers |
| **Adaptive Learning Rate**| 0.00 | 0.05 | 0.15 | 0.35 | 0.80 (Instant counter) |
| **Cross-Session Memory** | ❌ | ❌ | ❌ | ❌ | ✅ (`localStorage`) |

---

## 12. HITBOXES, DAMAGE, DISMEMBERMENT & RAGDOLLS

### 12.1 Hitbox Spheres & Damage Multipliers
Hit tests in `raycast()` evaluate multiple hierarchical spheres transformed by skeletal matrices:
- **Head (`head`)**: Radius `0.3m * scale`. Crit multiplier = **2.0×** (`info.crit = true`). Triggers slow-motion hitstop (`0.05s`).
- **Torso (`torso`)**: Radius `0.33m * scale`. Standard damage (`1.0×`).
- **Hips (`hips`)**: Radius `0.20m * scale`. Standard damage (`1.0×`).
- **Limbs (`armL`, `armR`, `legL`, `legR`)**: Radius `0.11 - 0.13m * scale`. Reduced damage (`0.75×`).
- **Riot Shield (`shield`)**: Radius `0.66m * scale`. Completely absorbs bullets, emitting orange sparks. Breaks after 2 katana strikes or blast explosions.

### 12.2 Dismemberment & Gibbing System (`kill`)
When an enemy dies with overkill damage ($-\text{HP} > 0.35 \times \text{MaxHP}$, katana strike, blast, or headshot crit):
- **Decapitation**: `headG` detaches with an explosive upward ink fountain.
- **Limb Amputation**: Random arms and legs detach and fly off as physics debris with rotational spin.
- **Bisection**: Katana attacks can slice the torso off the hips, creating dual ink geysers.
- **Topple Ragdoll**: If intact, dead bodies fall over along the X or Z axis with damped angular rotation, leaving an ink puddle pool on the floor before despawning at 9 seconds.

---

## 13. NETWORKING & MIRROR SYNCHRONIZATION

For multiplayer survival and co-op, enemy updates are compressed into compact snapshot arrays:

### 13.1 Snapshot Schema (`snapshot()`)
```javascript
[
  e.id,                          // 0: Entity ID
  +b.pos.x.toFixed(2),           // 1: X Coordinate
  +b.pos.y.toFixed(2),           // 2: Y Coordinate
  +b.pos.z.toFixed(2),           // 3: Z Coordinate
  +e.yaw.toFixed(2),             // 4: Facing Yaw
  STATE_CODES[e.state],          // 5: State (0:spawn, 1:hunt, 2:stunned, 3:dead)
  Math.round(e.hp),              // 6: HP
  +e.aimAmt.toFixed(2),          // 7: Aim blend weight
  +e.attackT.toFixed(2),         // 8: Melee timer
  e.fuseT >= 0 ? 1 : 0,          // 9: Fuse lit
  e.bossAtk ? 1 : 0              // 10: Boss attack active
]
```
Clients render **100ms behind** the latest received snapshot using hermite/linear interpolation (`snapA` to `snapB`) to mask packet jitter, while local hitmarkers provide instant client-side feedback.

---

## 14. IDENTIFIED BOTTLENECKS & POTENTIAL UPGRADE VECTORS

*(For external AI models / engineers looking to propose next-generation upgrades)*

1. **Hierarchical Task Network (HTN) or Behavior Tree Modularization**:
   - *Current State*: `_think()` is a monolithic function with sequential `if/else` checks.
   - *Upgrade*: Decompose into formal BT Nodes (`Selector`, `Sequence`, `Decorator`) or an HTN planner for multi-step goals (e.g., "Fall back to health station, draw shield, cover doorway").
2. **True 3D Catwalk / Multi-Tier Navigation**:
   - *Current State*: The NavMesh grid is mostly 2.5D with height delta tolerances. Enemies on lower levels can get confused if a player is standing directly above them on a metal grating.
   - *Upgrade*: True 3D navigation links with explicit jump-down edges and ladder/grapple traversal points.
3. **Dynamic Squad Voice Barks & Radio Chatter**:
   - *Current State*: The AI announces adaptations purely through HUD banners (e.g. "ENEMIES ADAPTING: FLUSHING CAMPER").
   - *Upgrade*: Synthesize procedural audio pencil scribbles or distinct radio bark SFX when enemies switch to flank, suppress, or retreat modes.
4. **Utility-Based Action Selection**:
   - *Current State*: Weapon firing triggers automatically whenever `cool <= 0` and in range.
   - *Upgrade*: Score actions (Shoot vs. Reposition vs. Throw Grenade vs. Fall Back) using continuous utility curves based on health, ammunition, ally density, and cover safety.
5. **Boss Phase Transitions & Enrage Mechanics**:
   - *Current State*: Bosses maintain constant attack tables regardless of whether they have 100% or 10% HP.
   - *Upgrade*: Multi-stage boss transitions (e.g., The Eraser splits into two mini-erasers at 50% HP; The Doodler's pen catches fire with red ink at 25% HP).

---
*End of specification (`enemy.md`). File generated for high-context ingestion and evaluation.*
