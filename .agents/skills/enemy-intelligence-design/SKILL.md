---
name: enemy-intelligence-design
description: >
  Mandatory reference for designing and creating new enemies in Doodle Strike.
  Defines the role-based tag system, intelligence behavior mapping, required
  properties, and spawn variable initialization. Every agent creating or
  modifying enemies MUST follow this specification to prevent crashes and
  ensure intelligent AI behaviors are automatically inherited.
---

# Enemy Intelligence Design Specification

## Purpose

This skill is the single source of truth for how enemies are defined in Doodle Strike. It governs the **role-based tag system** that powers all difficulty-scaled AI intelligence. When you follow this specification, a new enemy will automatically inherit evasive jumping, cover-seeking, flanking, retreat, memory, sound hunting, and every other intelligent behavior — **without writing any new AI code**.

> **CRITICAL**: Every new enemy MUST have the required intelligence tags. Omitting them will cause the enemy to have NO intelligent behaviors at all, or worse, crash the game with undefined property access.

---

## File Locations

| File | Purpose |
|---|---|
| `src/enemies.js` | `TYPES` definitions, `spawn()` initializer, `_think()` AI brain, `_shoot()`, helper functions |
| `src/weapons.js` | Sound broadcast on player weapon fire (God Mode) |
| `src/player.js` | Grenade broadcast on player grenade throw (Extreme+) |

---

## The Role-Based Tag System

### Required Tags (MANDATORY on every enemy)

Every enemy entry in the `TYPES` object **MUST** include these tags as the very first properties:

| Tag | Type | Values | Purpose |
|---|---|---|---|
| `role` | `string` | `'ranged'`, `'melee'`, `'kamikaze'`, `'aerial'`, `'boss'` | Defines the enemy's combat archetype. Controls which code paths execute in `_think()`. |
| `canDodge` | `boolean` | `true` / `false` | Can this enemy perform evasive jumps when shot (Hard+) and constant combat dodges (God Mode)? Set `false` for heavy, shielded, airborne, or oversized units. |
| `canCover` | `boolean` | `true` / `false` | Can this enemy seek cover behind walls when wounded? Set `false` for suicide units, airborne units, and bosses. |
| `canRetreat` | `boolean` | `true` / `false` | Will this enemy flee to cover when HP drops below 30%? Set `false` for berserkers, suicide units, and bosses. |
| `canFlank` | `boolean` | `true` / `false` | Will this enemy approach the player from a 90° offset angle on God Mode? Set `false` for stationary or aerial units. |

### Optional Tags

| Tag | Type | Default | Purpose |
|---|---|---|---|
| `berserker` | `boolean` | `false` (absent) | If `true`, this enemy never retreats and ignores grenade alerts. Used for aggressive melee chargers. |
| `stationary` | `boolean` | `false` (absent) | If `true`, this enemy does not move while in firing range. Used for snipers and turrets. |
| `shield` | `boolean` | `false` (absent) | If `true`, this enemy has a frontal shield that absorbs hits. |
| `flying` | `boolean` | `false` (absent) | If `true`, this enemy is airborne and uses the `_thinkFlyer()` brain instead of `_think()`. |
| `boss` | `boolean` | `false` (absent) | If `true`, this enemy uses `_thinkBoss()` and has special attack patterns. |

---

## Role Definitions

### `'ranged'` — Projectile Fighters
Enemies that shoot from a distance. They strafe, keep distance, and use cover.
- **Examples**: Grunt, Heavy, Sniper, Shieldbearer
- **Weapon types**: `'rifle'`, `'shotgun'`, `'sniper'`, `'pistol'`, or any custom ranged weapon
- **Required fields**: `range`, `stop`, `keep`, `cool`, `dmg`, `spread`, `pspeed`

### `'melee'` — Close-Combat Fighters
Enemies that close distance and attack physically. They charge, lunge, and swing.
- **Examples**: Rusher
- **Weapon types**: `'blade'` or any custom melee weapon
- **Required fields**: `lunge`, `reach`, `standoff`, `cool`, `dmg`

### `'kamikaze'` — Self-Destruct Units
Enemies that charge toward the player and explode. They have NO self-preservation instincts.
- **Examples**: Bomber
- **Weapon types**: `'bomb'`
- **Required fields**: `fuseRange`, `fuse`, `blast`, `dmg`
- **Intelligence**: ALL intelligence tags MUST be `false`. Kamikaze units do not dodge, cover, retreat, or flank.

### `'aerial'` — Airborne Units
Enemies that fly. They use a completely separate movement system (`_thinkFlyer()`).
- **Examples**: Flyer (Paper Wasp)
- **Weapon types**: `'dive'`
- **Required fields**: `dmg`, `cool`
- **Intelligence**: ALL intelligence tags MUST be `false`. Aerial units have their own orbit/dive/climb state machine.
- **MUST set**: `flying: true`, `model: 'flyer'`

### `'boss'` — Boss Units
Massive enemies with unique multi-phase attack patterns.
- **Examples**: The Doodler, The Eraser, The Inkblot
- **Weapon types**: `'boss'`
- **Required fields**: `bossKind`, `range`, `stop`, `keep`, `cool`, `dmg`
- **Intelligence**: ALL intelligence tags MUST be `false`. Bosses have dedicated `_thinkBoss()` brains.
- **MUST set**: `boss: true`

---

## Intelligence Behaviors by Difficulty

The `_think()` function in `src/enemies.js` reads the tags and activates behaviors based on `window.currentDifficulty`:

| Diff | Name | Value | Behaviors Activated |
|---|---|---|---|
| 0 | Stupid | `0` | Panic freeze on first sight, friendly fire allowed, slow reaction |
| 1 | Easy | `1` | Basic AI, slightly faster reactions |
| 2 | Hard | `2` | Evasive jumps (`canDodge`), memory (last known position), predictive aim, friendly fire avoidance |
| 3 | Extreme | `3` | All of Hard + cover seeking (`canCover`), wounded retreat (`canRetreat`), grenade awareness, reactive dodge roll |
| 4 | God Mode | `4` | All of Extreme + constant combat dodge (`canDodge`), flanking (`canFlank`), sound hunting (converge on gunshots) |

### Behavior → Tag Mapping (Quick Reference)

| Behavior | Tag Check | Minimum Difficulty |
|---|---|---|
| Panic Freeze | `role !== 'kamikaze' && role !== 'aerial' && !T.boss` | Stupid (0) |
| Friendly Fire (no avoidance) | `role === 'ranged'` | Stupid (0) |
| Evasive Jump on Hit | `T.canDodge` | Hard (2) |
| Memory (last known position) | `role !== 'aerial'` | Hard (2) |
| Predictive Aim | all enemies | Hard (2) |
| Cover Seeking (wounded) | `T.canCover` | Extreme (3) |
| Wounded Retreat | `T.canRetreat && !T.berserker` | Extreme (3) |
| Grenade Awareness | `!T.berserker && role !== 'kamikaze'` | Extreme (3) |
| Constant Combat Dodge | `T.canDodge` | God Mode (4) |
| Flanking | `T.canFlank` | God Mode (4) |
| Sound Hunting | `role !== 'kamikaze' && role !== 'aerial'` | God Mode (4) |

---

## Spawn Variables (Automatically Initialized)

The `spawn()` function in `src/enemies.js` initializes these AI state variables on every enemy. **You do NOT need to add these manually** — they are added automatically. They are listed here for reference only:

```
justHit: false        — Set true in damage(), read/cleared by _think()
coverPoint: null      — THREE.Vector3 destination behind cover, or null
coverT: 0             — Timer: how long to stay behind cover
retreating: false     — Currently fleeing to cover
lastKnownPos: null    — Player's last seen position (memory system)
panicT: 0             — Stupid: freeze timer on first sight
hasPanicked: false    — Stupid: only panic once per spawn
dodgeCooldown: 0      — Prevents dodge spam between dodges
soundAlert: null      — THREE.Vector3 position of last heard gunshot
flankAngle: ±π/2      — God Mode: offset angle for flanking approach
coordReady: false     — Reserved for future coordinated push behavior
```

---

## How to Create a New Enemy

### Step 1: Define the TYPES entry

Add a new entry to the `TYPES` object in `src/enemies.js` (line 14). Always put the intelligence tags first:

```js
// Example: A fast, dodgy assassin that flanks but never retreats
assassin: {
  role: 'melee',
  canDodge: true, canCover: true, canRetreat: false, canFlank: true,
  berserker: true,
  hp: 55, speed: 9.0, weapon: 'blade',
  lunge: 3.2, reach: 3.2, standoff: 2.0,
  cool: [0.8, 1.2], dmg: 18, score: 160, scale: 0.9,
  name: 'ASSASSIN', hat: 'hood',
  build: { bodyW: 0.75, headS: 0.9, limbR: 0.025 }
}

// Example: A stationary turret that cannot move but has heavy firepower
turret: {
  role: 'ranged',
  canDodge: false, canCover: false, canRetreat: false, canFlank: false,
  stationary: true,
  hp: 250, speed: 0, weapon: 'rifle',
  range: 40, stop: 40, keep: 0,
  burst: 8, burstInt: 0.08, cool: [1.0, 1.5],
  dmg: 4, spread: 0.04, pspeed: 40,
  score: 220, scale: 1.0,
  name: 'INK TURRET', model: 'turret',
  build: {}
}

// Example: A flying bomber drone
drone: {
  role: 'aerial',
  canDodge: false, canCover: false, canRetreat: false, canFlank: false,
  flying: true, model: 'flyer',
  hp: 30, speed: 7.0, weapon: 'dive',
  dmg: 8, cool: [2.0, 3.0],
  score: 110, scale: 1.2,
  name: 'INK DRONE'
}
```

### Step 2: Register in wave pool (if applicable)

In `src/main.js`, add the enemy to the wave spawn pool:

```js
{ t: 'assassin', from: 4, w: 4 }  // Appears from wave 4, weight 4
```

### Step 3: Register in Map Registration (if applicable)

Follow `AGENTS.md` Universal Map Registration rules.

### Step 4: Verify

Run syntax check:
```bash
node -c src/enemies.js
```

---

## Decision Guide: Setting the Tags

Use this flowchart when deciding tag values for a new enemy:

### `role`
- Does it shoot projectiles? → `'ranged'`
- Does it attack with melee at close range? → `'melee'`
- Does it self-destruct? → `'kamikaze'`
- Does it fly? → `'aerial'`
- Is it a massive multi-phase boss? → `'boss'`

### `canDodge`
- Is it lightweight and agile? → `true`
- Is it heavy, shielded, airborne, a suicide unit, or a boss? → `false`

### `canCover`
- Is it a ground unit that would logically hide behind walls? → `true`
- Is it airborne, a suicide unit, or a boss? → `false`

### `canRetreat`
- Does it have self-preservation instincts? → `true`
- Is it a berserker, suicide unit, or boss? → `false`

### `canFlank`
- Is it mobile enough to circle around the player? → `true`
- Is it stationary, airborne, or a boss? → `false`

### `berserker`
- Does it get MORE aggressive when hurt instead of running away? → `true`
- Otherwise → omit (defaults to `false`)

---

## Common Mistakes to Avoid

| Mistake | Consequence | Fix |
|---|---|---|
| Forgetting `role` | AI brain skips all role-specific code paths | Always set `role` as the very first property |
| Setting `canDodge: true` on a Heavy | Heavy units look absurd leaping sideways | Heavy/shielded units should have `canDodge: false` |
| Setting `canRetreat: true` on a berserker | Contradicts the berserker personality | If `berserker: true`, always set `canRetreat: false` |
| Setting ANY intelligence tag to `true` on a kamikaze | Suicide units hiding behind cover defeats their purpose | All tags MUST be `false` for `role: 'kamikaze'` |
| Setting ANY intelligence tag to `true` on a boss | Bosses have dedicated `_thinkBoss()` logic; intelligence tags are ignored | All tags MUST be `false` for `role: 'boss'` |
| Setting ANY intelligence tag to `true` on an aerial unit | Aerial units use `_thinkFlyer()`; ground intelligence is skipped | All tags MUST be `false` for `role: 'aerial'` |
| Forgetting `weapon` field | Crash in `_think()` when checking weapon type | Always specify a weapon |
| Forgetting `cool` array | Crash when calculating fire cooldown | Always specify `cool: [min, max]` |
| Missing `build` object for humanoid enemies | Crash when constructing the doodle model | Always include `build: { bodyW, headS, limbR }` or use `model: 'bomber'`/`'flyer'`/`'blob'` |

---

## Existing Enemy Reference

| Key | Role | Dodge | Cover | Retreat | Flank | Special |
|---|---|---|---|---|---|---|
| `grunt` | ranged | ✅ | ✅ | ✅ | ✅ | — |
| `rusher` | melee | ✅ | ✅ | ❌ | ✅ | berserker |
| `heavy` | ranged | ❌ | ✅ | ✅ | ✅ | — |
| `sniper` | ranged | ✅ | ✅ | ✅ | ❌ | stationary |
| `shield` | ranged | ❌ | ✅ | ✅ | ✅ | shield |
| `bomber` | kamikaze | ❌ | ❌ | ❌ | ❌ | — |
| `flyer` | aerial | ❌ | ❌ | ❌ | ❌ | flying |
| `boss` | boss | ❌ | ❌ | ❌ | ❌ | boss |
| `eraser` | boss | ❌ | ❌ | ❌ | ❌ | boss |
| `inkblot` | boss | ❌ | ❌ | ❌ | ❌ | boss |
