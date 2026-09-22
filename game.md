# DOODLE STRIKE: Master Game Design, Look & Feel, and Architectural Specification

> **Document Purpose**: This document is an exhaustive, production-grade specification of **Doodle Strike**. It details every visual rule, mathematical shader formula, gameplay mechanic, movement kinematic, audio synthesis technique, enemy behavioral routine, and system architecture. Any software engineer or AI agent reading this document can recreate the entire game from scratch without ambiguity.

---

## 1. Executive Summary & Core Concept

**Doodle Strike** is a fast-paced, high-mobility tactical first-person shooter (FPS) set entirely inside the pages of a student's lined spiral notebook. 

Everything in the game—characters, architecture, weapons, bullets, user interface, and particle effects—is rendered as if it were hand-drawn in real time using **ballpoint pens (biros), graphite pencils, and highlighter markers** on textured notebook paper complete with blue horizontal ruled lines, a vertical red left margin, and micro-paper fiber imperfections.

### The Core Fantasy
- **Visual Feel**: You are playing inside an interactive, living high-school notebook doodle. When you shoot an enemy, ink splatters across the page and figures crumple into erased graphite scribbles.
- **Gameplay Feel**: Fast, fluid, modern tactical arena shooter mechanics inspired by high-mobility arena games: sliding, air dashing, wall jumping, mantle climbing, momentum swing grappling, katana deflection/parrying, and tight gunplay with zero parallax.
- **Platform Agnostic**: 60-120 FPS in pure WebGL (Three.js), playable seamlessly on Desktop (mouse/keyboard/gamepad) and Mobile/Tablet (tactical dual-fire touch HUD with floating joysticks and customizable layouts). Zero external model or audio assets required.

---

## 2. Visual Aesthetic & The Biro Rendering Pipeline

The visual presentation is the soul of the game. It is not a generic cel-shading filter; it is a **physically-motivated, screen-and-world-space hybrid pen-and-ink illustration pipeline**.

### 2.1 The Notebook Color Palette
All entities in the world are mapped to a strict school-stationery ink index:
| Ink ID | Name | RGB Vector `(R, G, B)` | Material Association |
| :--- | :--- | :--- | :--- |
| **0** | **Blue Ballpoint (Biro)** | `vec3(0.14, 0.28, 0.76)` | Primary player weapon, structural steel, primary architecture, player rope. |
| **1** | **Red Marking Pen** | `vec3(0.86, 0.14, 0.22)` | Enemy ink blood, danger zones, red notebook margin, sniper laser telegraphs, damage vignettes. |
| **2** | **Graphite Pencil / Black Ink** | `vec3(0.22, 0.24, 0.30)` | Outlines, asphalt, mechanical barrels, clock hands, tires, iron hardware. |
| **3** | **Orange Highlighter** | `vec3(0.92, 0.55, 0.08)` | Muzzle flash stars, tactical cover crates, interactables, tactile curbs, split-flap displays. |
| **4** | **Green Highlighter** | `vec3(0.12, 0.60, 0.30)` | Recycling bins, foliage, stamina meters, health kit accents. |
| **5** | **Pink Eraser** | `vec3(0.90, 0.40, 0.66)` | The Eraser boss, eraser crumbs, melee strike deflect flashes. |

#### The Paper Canvas (`uPaper`)
- Color: Warm ivory notebook paper `vec3(0.965, 0.955, 0.935)`.
- Ruled Lines: Horizontal blue lines repeating at `uLineSpacing` (approx. 24–32px).
- Left Margin: Single vertical red rule located at `7%` of the viewport width (`x = uRes.x * 0.07`).
- Fiber Grain: Subtle procedural 2D value noise layered over the paper tone to mimic fibrous pulp texture.

### 2.2 Dual-Pass G-Buffer Architecture
The rendering pipeline operates in two passes:
1. **Pass 1: G-Buffer Scene Pass**
   - Scene meshes are rendered into a `HalfFloatType` WebGL render target (`tScene` + `tDepth`).
   - The fragment shader outputs:
     - `gl_FragColor.r`: Shading intensity `clamp(dot(N, L) * shadeScale + shadeBias, 0.0, 1.0)`. If an object is marked as solid flat fill (e.g., weapon icons, eyes), output `-1.0`.
     - `gl_FragColor.g`: The ink ID (0 to 5).
     - `gl_FragColor.b, a`: View-space surface normal `X, Y` components.
     - Depth buffer: 24-bit linear depth.

2. **Pass 2: Fullscreen Post-Processing Shader (`postFrag`)**
   The fullscreen quad reconstructs world geometry and applies three distinct illustration layers:

#### A. Inverse-Depth Laplacian Outlines (Scale-Invariant Biro Contours)
Standard Sobel depth filters create ugly crevice shadow bands across flat floors seen at grazing angles. Doodle Strike solves this with a **Laplacian of Inverse Depth (`1/d`)**:
$$\text{lap} = \left| \frac{1}{d(x-1)} + \frac{1}{d(x+1)} - \frac{2}{d(x)} \right| + \left| \frac{1}{d(y-1)} + \frac{1}{d(y+1)} - \frac{2}{d(y)} \right|$$
- Because $\frac{1}{d}$ is strictly affine across any flat plane under perspective projection, $\text{lap} = 0$ on floors, ceilings, and flat walls.
- Silhouette edges produce high Laplacian spikes. Dividing by $\frac{1}{d}$ makes the outline threshold scale-invariant, ensuring distant rooftops have the exact same razor-thin pen contour width as objects right in front of the camera.
- Normal edges: $\Delta N = \|N_{\text{left}} - N_{\text{right}}\| + \|N_{\text{up}} - N_{\text{down}}\|$ detects sharp geometric creases.
- Edge width wavering: Micro-procedural noise adds a human hand tremor to ink outlines.

#### B. World-Anchored Biro Crosshatching
Shading is never smooth gradient lighting; it is **hand-drawn crosshatching**:
- **World Coordinate Reconstruction**: Every pixel's world-space position $\mathbf{W}_{\text{pos}}$ is computed from screen depth and inverse projection/view matrices.
- **Triplanar Planar Projection**: Hatching strokes are projected onto the dominant surface axis (e.g. horizontal surfaces use $XZ$, vertical walls use $XY$ or $ZY$). This guarantees that hatching lines **stay anchored to the walls as the player walks past them**, eliminating swimming/crawling artifacts.
- **Power-of-Two LOD Quantization**: To prevent dense moiré shimmering at a distance, line spacing steps in powers of two:
  $$\text{LOD} = 2^{\lfloor \log_2(\text{dist} \cdot c) \rfloor}, \quad \text{spacing} = 0.16 \cdot \text{LOD}, \quad \text{width} = \text{spacing} \cdot 0.125$$
- **Multi-Angle Shading Tiers**:
  - *Tier 1 (Light Shadow)*: Diagonal stroke at $+45^\circ$ (`d1 = vec2(0.707, 0.707)`).
  - *Tier 2 (Medium Shadow)*: Opposing cross stroke at $-45^\circ$ (`d2 = vec2(-0.707, 0.707)`).
  - *Tier 3 (Deep Crevice)*: Steep third stroke at $+75^\circ$ (`d3 = vec2(0.259, 0.966)`).
  - *Shadow Floor Air*: Deep shadows are capped at $28\%$ opacity (`smoothstep(0.10, 0.0, shade) * 0.28`), ensuring the paper texture and ruled lines always breathe through dark regions rather than turning into muddy black blotches.

#### C. First-Person Weapon Exception
First-person viewmodels (guns, hands, blades) move with the camera. For fragments within $d < 2.0\text{m}$, hatching coordinates switch from world-space to camera-space screen coordinates so the pen strokes on the gun stay fixed to the weapon model during locomotion.

---

## 3. Player Locomotion, Kinematics & Mobility Systems

Movement is designed around momentum preservation, verticality, and responsive tactile feel.

### 3.1 Base Movement Attributes
- **Walking Speed**: $6.6\text{ m/s}$
- **Sprinting Speed**: $10.6\text{ m/s}$
- **Crouch Speed**: $3.6\text{ m/s}$
- **Jump Impulse**: $9.6\text{ m/s}$ upward
- **Gravity**: $26.0\text{ m/s}^2$ (fast, snappy fall velocity)
- **Ground Friction**: $8.0$
- **Ground Acceleration**: $140\text{ m/s}^2$ (instant snappy starts/stops)
- **Air Acceleration**: $36\text{ m/s}^2$ with an air cap of $7.5\text{ m/s}$
- **Eye Heights**: Standing = $1.60\text{m}$, Crouching/Sliding = $0.88\text{m}$

### 3.2 Advanced Tactical Moves
1. **Slide**: Crouching while sprinting above $7.0\text{ m/s}$ initiates a ground slide. The camera tilts ($+4^\circ$ roll), eye height drops to $0.88\text{m}$, friction drops, and the player slides up to $12\text{m}$. Sliding down ramps accelerates the player.
2. **Air Dash / Lunge**: Pressing dash expends stamina to propel the player forward with an instantaneous $12\text{ m/s}$ burst, accompanied by a sudden FOV pop and wind rush sound effect.
3. **Wall Jump & Mantle**:
   - Approaching any vertical wall while airborne allows a wall jump: pushing off with lateral velocity and a vertical boost ($+8.0\text{ m/s}$).
   - Approaching a ledge at chest/waist level automatically mantles the player smoothly onto the surface.
4. **Swing-Grapple Hook (Momentum Grappling)**:
   - Target radial grapple rings mounted on buildings, street lamps, and towers.
   - Pressing the grapple button fires a blue ballpoint ink cord (`src/player.js`).
   - Upon attachment, the cord acts as a tension spring pendulum. Players can swing around corners, pump momentum, reel in closer, or cancel the grapple at the peak of an arc to launch high into the sky.
   - Stamina wheel governs continuous grapple usage.

### 3.3 Parallax-Free Optical Gunplay
- The player camera pitch and yaw are tracked in radians.
- **Weapon Raycasting Law**: Bullets, shotgun pellets, and raycasts are ALWAYS cast from `camera.getWorldPosition()` directly along `camera.getWorldDirection()`.
- The first-person gun model is animated with procedural recoil springs (`Spring3`), weapon sway dampening, and walking head bobbing, but weapon barrel alignment is never used for bullet origin. This guarantees that **shots land 100% true to the screen crosshair center**, eliminating parallax disconnect.

---

## 4. Weapons & Combat Arsenal

The arsenal blends modern tactical firearms with authentic stationery metaphors and a deep melee parry system.

### 4.1 Weapon Catalog
1. **Assault Rifle**:
   - Magazine: 35 rounds, fully automatic ($11\text{ rounds/sec}$).
   - Damage: $24\text{ body} / 62.4\text{ head}$ ($2.6\times$ multiplier).
   - Feel: Rapid orange starburst muzzle flashes, ejected golden ink shell casings, climbing recoil spring, tight ADS spread.
2. **Pump Shotgun**:
   - Magazine: 6 shells, manual pump cycle ($0.78\text{s}$ interval).
   - Damage: 10 pellets $\times 19\text{ dmg} = 190\text{ max dmg}$ close range.
   - Feel: Heavy screen kick, wide spread bloom, hitstop freeze-frame on close-range meatshots. Red ink shells.
3. **Bolt-Action Sniper Rifle**:
   - Magazine: 5 rounds, bolt cycle ($0.85\text{s}$).
   - Damage: $150\text{ body} / 450\text{ head}$ (instant one-shot erasure).
   - Scope: ADS transitions into full-screen optical scope with blur mask, blue crosshairs, and zero sway.
4. **Heavy Revolver**:
   - Magazine: 6-cylinder hand cannon.
   - Damage: $62\text{ body} / 186\text{ head}$ ($3.0\times$ headshot multiplier).
   - Feel: Sharp crisp bang, heavy vertical kick.
5. **Doodle Katana (Melee & Deflection System)**:
   - Slashing: 3-hit dynamic combo (left slash, right slash, overhead downward chop).
   - In-Arc Cleave: Slashes strike all enemies within a $3.0\text{m}$ $110^\circ$ cone, cutting environmental ropes and shattering crates.
   - **Guard & Parry**: Holding ADS raises the katana in front of the player.
     - Regular Guard: Deflects frontal bullets away with spark effects.
     - **Perfect Parry**: Tapping guard within $0.15\text{s}$ of an incoming projectile reflects the bullet directly back at the attacker and triggers a time dilation hitstop.
   - **Blade Ink Soaking**: The katana mesh starts clean silver-white. As you kill enemies, red ink soaks onto the blade geometry; over time, the ink slowly drips off.
6. **Fragmentation Ink Grenades**:
   - Throwing arc projected via ballistic trajectory prediction.
   - Bounces off walls and floors; detonates into a devastating sphere of ink shrapnel that coats nearby geometry with black ink splatters.

---

## 5. Enemy Hierarchy & Intelligent AI

Enemies are modeled as animated stick figures (`buildHumanoid`) constructed from bent tubes (`noodle`), oval bodies (`blob`), and expressive paper hats. They possess distinctive facial expressions (angry brows, dot eyes, and dead 'X' eyes upon defeat).

### 5.1 Enemy Archetypes
| Type | Role | HP | Speed | Weapon | Behavior Profile |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Grunt** | Ranged | 100 | $5.2\text{ m/s}$ | Rifle | Takes cover behind waist-high blocks, peeks, fires 3-round bursts, retreats when low HP. |
| **Rusher** | Melee | 70 | $7.6\text{ m/s}$ | Katana | Sprinting ninja with headband; zig-zags erratically to dodge bullets, lunges with rapid slashes. |
| **Heavy** | Tank | 420 | $2.8\text{ m/s}$ | Shotgun | Colossal stick figure with steel helmet and riot shield. Slow advance, devastating up close. |
| **Sniper** | Perch | 60 | $4.8\text{ m/s}$ | Sniper | Camps on high rooftops; projects a visible red laser telegraph for $1.6\text{s}$ before firing. |
| **Shieldbearer** | Defense| 150 | $3.8\text{ m/s}$ | Pistol | Frontal steel shield completely immune to frontal bullets. Player must flank, jump over, or parry. |
| **Ink Bomb** | Kamikaze| 26 | $6.5\text{ m/s}$ | Bomb | Fast spherical runner with a burning fuse; beeps rapidly and explodes in a $4.2\text{m}$ ink blast. |
| **Paper Wasp** | Aerial | 40 | $6.2\text{ m/s}$ | Dive | Origami folded paper wasp flying overhead; swoops down in parabolic dive attacks. |

### 5.2 Monumental Bosses
1. **The Doodler (Boss 1)**: Giant stick figure wearing a crown wielding a colossal 2.4m wooden pencil. Teleports across platforms, stabs the pencil into the ground to emit shockwaves, and shoots rotating spirals of ink projectiles.
2. **The Eraser (Boss 2)**: Colossal pink rubber wedge block. Sweeps wide laser erasure beams across the arena that instantly obliterate geometry cover and player health.
3. **The Inkblot (Boss 3)**: Amorphous multi-tentacled black ink blob that splits into smaller mini-blobs upon taking threshold damage.

### 5.3 Tactical AI Brain (`EnemyBrain`)
- **NavMesh Navigation**: Traverses maps using A* pathfinding across convex polygonal nodes.
- **Sensory Perception**: Field of view ($140^\circ$) and sound perception (gunshots within $35\text{m}$ instantly alert enemies).
- **Behavior States**: `IDLE` $\to$ `INVESTIGATING` $\to$ `COMBAT` (Strafe, Seek Cover, Flank, Retreat).

---

## 6. Maps & Level Architecture

Doodle Strike maps follow the **3-Lane Competitive Tactical Blockout Standard** combined with the **Skeleton-Skin-Trim Universal Detailing Standard**.

### 6.1 Core Map Catalog
1. **Doodle District (Urban Warfare)**:
   - Dense multi-tier city blocks: asphalt ground streets, 2-story brick tenement walk-ups, fire escapes, rooftop alleys, and skybridge planks.
   - Atmospheric paper airplanes gliding in circles overhead that players can grapple onto.
2. **The Giant Classroom (Colossal Scale)**:
   - Micro-combatants inside a monumental school room.
   - Scale: Desks are 12m tall, wooden rulers act as ramp bridges, stacked textbooks form multi-story fortress towers, giant metal pencil sharpeners serve as cover, and chalkboards feature handwritten trigonometry equations.
3. **Doodle Transit Terminal (Bus Station)**:
   - Modernist concrete bus concourse with twin boarding bays (West & East), marked asphalt roadways, raised pedestrian islands ($Y=0.45\text{m}$), and cantilevered steel bay canopies ($Y=8.5\text{m}$).
   - Fleet of 4 full 12-meter commuter transit coaches with mantleable roofs, side passenger windows, and wheel cover.
   - Elevated Mezzanine Skybridge ($Y=4.8\text{m}$) spanning across the bays with 15-step staircases.
   - Four-sided Departure Clock Tower ($Y=16.0\text{m}$) with split-flap destination schedule boards and an apex momentum grapple ring.

### 6.2 Universal Detailing Standard (The Triad Law)
Every structure in the environment must be built in three anatomical tiers:
1. **Skeleton (Primary Load-Bearing Geometry)**: Heavy foundations, concrete piers, steel I-beams, floor slabs. Solid collision.
2. **Skin (Functional Surface Shell)**: Walls, floorboards, window glass panels, bus coach chassis. Solid collision.
3. **Trim & Micro-Detailing (Stationery & Fasteners)**: Screws, brackets, tactile curb bevels, split-flap text, wipers, turnstiles, and cable ties. Must be flagged with `noCollide: true` if under $0.30\text{m}$ to prevent snagging player movement.
