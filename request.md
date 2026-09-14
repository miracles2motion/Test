# 🧠 DOODLE STRIKE: DREAM EVOLUTION REQUEST
## "From Cardboard Boxes to a Living Hand-Drawn World"

**Date**: 2026-09-14  
**Project**: Doodle Strike (3D Hand-Drawn Tactical Shooter / Three.js + Custom Biro Ink Shaders)  
**Document Purpose**: Architectural & Algorithmic Request Document to feed to Frontier LLMs (Claude 3.7 Sonnet/Opus, OpenAI o3/GPT-4.5, Gemini 2.0 Pro)  
**Core Thesis**: Transform Dream from a static, box-stacking template engine into an **interactive, apprentice-learning procedural architect** capable of generating rich, organic, hand-drawn colossal worlds.

---

## 1. THE SOUL OF DOODLE STRIKE: THE MACRO-COLOSSAL WORLD

Before addressing code, the external AI must understand the **creative core** of this game:

> **The Concept**: The player is a small hand-drawn "Doodle" character navigating an environment **far bigger than themselves**.
> - In **Giant Classroom** (our gold standard), the player is miniature: a textbook is a multi-story ramp, a pencil is a colossal fallen log barricade, an eraser is a waist-high bunker, a desk is a towering fortress, and a hanging ceiling lamp is an apex grapple vantage point.
> - In a **Forest**, the player shouldn't see video-game "scenery trees" — the player is navigating colossal titan redwoods where buttress roots are canyon walls, fallen hollow logs are sprint-through CQB tunnels, shelf fungi are spiral staircases, and the canopy is a multi-tier combat platform suspended 25 meters in the air.
> - In a **Beach**, a conch shell is a bunker, driftwood is an arched bridge, sand ripples are tactical defilade berms, and palm trees are multi-story momentum swing anchors.

**The Failure Today**: Dream forgets this scale and forgets the art style. It places rigid, 90-degree laser-cut cardboard boxes (`box()`), stacking them in flat symmetric patterns. A hollow log is literally 4 rectangular slabs glued together as a square tube. It feels artificial, flat, and lifeless.

---

## 2. THE THREE CORE ARCHITECTURAL CHALLENGES

We are seeking your expertise as Principal Procedural Generation Architect and Lead Technical Game Designer to design the solutions to these three challenges:

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  CHALLENGE 1: THE INTERACTIVE TEACHER-APPRENTICE DIALOG LOOP                 │
│  "Dream admits what it doesn't know, asks for real-world knowledge,         │
│   absorbs the 3D recipe dynamically, and remembers it forever."             │
├──────────────────────────────────────────────────────────────────────────────┤
│  CHALLENGE 2: PARAMETRIC & ORGANIC PROCEDURAL SHAPES                         │
│  "No more static clones. A tree can be gigantic, slender, bent, twisted, or  │
│   stout. Procedural generation with organic silhouettes and hand-drawn feel."│
├──────────────────────────────────────────────────────────────────────────────┤
│  CHALLENGE 3: COLOSSAL SCALE & VERTICAL TRAVERSAL DESIGN                     │
│  "Translating small doodles in colossal environments into tactical shooter   │
│   flow: multi-story set pieces, momentum grapple lines, and defensible cover"│
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. DETAILED BREAKDOWN OF THE CHALLENGES

### Challenge 1: The Interactive Teacher-Apprentice Ingestion Loop

#### The Problem:
Currently, procedural generation engines either have everything hardcoded beforehand or fail completely when encountering an unknown word. When a user tells Dream: `"Dream a tropical shipwreck beach"`, Dream has never heard of a `palm_tree`, a `coconut`, a `sun_lounger`, or a `ship_rib_cage`. 

#### What We Need from You:
Design an in-flight **Consultation & Recipe Ingestion Protocol** where Dream acts as an apprentice communicating with an AI master architect (or human director):

1. **The In-Flight Query (`TEACH_REQUEST`)**:
   - When Dream's layout engine needs an object it has no recipe for, how should it formulate its inquiry?
   - Schema for asking: real-world scale, tactical role (waist cover, full cover, traversable ramp, landmark), primitive composition, ink color hierarchy, and collision bounds.
2. **The Machine-Executable Recipe (`RECIPE_SPEC`)**:
   - Design a declarative, JSON-serializable 3D recipe format that an LLM can return in one shot.
   - The recipe must compile into Three.js primitives (`box`, `cyl`, `sphere`, `slab`, `ring`, `rail`, `cone`, `wedge`, `arch`, `pipe`) without requiring unsafe `eval()`.
3. **Persistent Memory Cataloging**:
   - How Dream permanently registers this new recipe into its local knowledge base (`.agents/thematic-memory.json` / `prefabs.js`) so that `palm_tree` becomes a permanent, reusable asset for all future maps.

---

### Challenge 2: Parametric & Organic Procedural Shapes (Killing the Box Trap)

#### The Problem:
Today, `prefabs.js` has static functions with hardcoded numbers: a pine tree is always exactly 12 meters tall with a 0.8m trunk. When placed across a forest, the player sees identical clones. Worse, organic shapes (fallen logs, boulders, mushroom caps) are forced into sharp 90-degree boxes because the engine lacks curved, faceted, or parametric primitives.

#### What We Need from You:
1. **The Organic Primitive Toolkit**:
   - What procedural primitives should we introduce to Three.js to represent organic, sketched hand-drawn objects? (e.g. `hollowPipe` for logs/tunnels, `wedge` for sloped rocks/roofs, `deformedRock` with vertex noise, `arch` for curved doorframes/cave openings).
2. **Parametric Variation Engine**:
   - How do we define a single generative recipe for an object (e.g., `Tree`, `Mushroom`, `Rock`, `Stalagmite`) that accepts continuous parameters:
     - `scale` ($0.5$ to $4.0\times$)
     - `slenderness` (stout and fat vs tall and spindly)
     - `branchiness / complexity` (single trunk vs multi-limb bough)
     - `lean / curvature` (straight vs windswept / bending)
     - `foliage density`
   - How should Dream’s PRNG seed select from these parameters to generate natural, believable groves, clusters, and variations without visual clones?
3. **The "Hand-Drawn Biro" Aesthetic Formulation**:
   - In a ballpoint pen sketch, lines are wobbly and organic. How do we introduce algorithmic vertex jitter, crosshatch line layering, and non-rectilinear angles into our geometry generation so that meshes feel like human sketchbook doodles rather than 1995 CAD boxes?

---

### Challenge 3: Colossal Scale & Vertical Exploration (Doodle Strike Gameplay)

#### The Problem:
In Doodle Strike, the player has dynamic movement: sliding, double-jumping, grappling onto ceiling rings with momentum swinging, and wall-kicking. When Dream generates a level, it often treats the ground as the only play space and platforms as isolated boxes with no connective tissue.

#### What We Need from You:
1. **Multi-Story Colossal Anatomy**:
   - Provide concrete algorithmic rules for turning ordinary everyday or natural props into multi-tiered gameplay arenas:
     - How does a giant fallen log have both an interior sprint-through defilade tunnel AND an exterior top catwalk with cover?
     - How does a giant tree incorporate spiral buttress root ramps, an intermediate trunk sniper balcony, and an apex canopy grapple network?
2. **Headroom & Reachability Guarantees**:
   - Formulas for ensuring that small characters moving at high speeds through colossal objects never get snagged on geometry, with verified $2.2\text{m}$ headroom and $1.8\text{m}$ hallway clearances.
3. **Grapple Highway Topology**:
   - How should grapple rings (`ring()`) be placed relative to colossal objects to create continuous "momentum highways" across the map?

---

## 4. WHAT TO PROVIDE IN YOUR SPECIFICATION

Please structure your response into clear, production-ready architectural deliverables:

1. **The Ingestion Protocol Schema**:
   - Exact JSON schemas for `TeachRequest` (Dream $\to$ LLM) and `RecipeResponse` (LLM $\to$ Dream).
2. **The Procedural Recipe Interpreter**:
   - A clean JavaScript interpreter that parses declarative `RecipeResponse` objects into Three.js geometry calls with collision flags.
3. **The Parametric Organic Toolkit**:
   - Implementation code / mathematical algorithms for:
     - A true curved `hollowCylinder` / `hollowLog` (with interior and exterior collision).
     - A parametric `treeGenerator` with height, girth, lean, and branch parameters.
     - A faceted `boulderGenerator` with randomized organic vertex noise.
4. **Colossal Level Design Rules**:
   - A framework for scaling ordinary objects into miniature-player combat set-pieces (scale factors, stairway landings, cover lip heights, grapple clearances).
5. **Step-by-Step Implementation Roadmap**:
   - How to integrate this cleanly into our existing codebase without disrupting the Three.js rendering pipeline.

---

*Feed this document to Claude 3.7 Sonnet / Opus, OpenAI o3 / GPT-4.5, or Gemini 2.0 Pro to receive the full technical implementation.*
