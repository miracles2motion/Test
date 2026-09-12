# Tactical Menu & Mission Deployment Interface Specification

A master structural, visual, and architectural specification for the modernized **Mission Deployment & Map Selection Interface** in **Doodle Strike**. 

Designed to scale seamlessly from 2 maps to 10+ operational theaters, this specification upgrades the legacy compact dialog into an expansive, AAA-grade tactical shooter menu inspired by modern military FPS interfaces, while preserving the game's distinctive hand-drawn ballpoint ink and notebook aesthetic.

---

## Table of Contents
1. [Core Objectives & Legacy Limitations](#1-core-objectives--legacy-limitations)
2. [Tactical Interface Architecture](#2-tactical-interface-architecture)
3. [The Map Deployment Carousel & Tactical Cards](#3-the-map-deployment-carousel--tactical-cards)
4. [Tactical Mission Dossier & Map Intel Panel](#4-tactical-mission-dossier--map-intel-panel)
5. [Theater Categories & Filtering System](#5-theater-categories--filtering-system)
6. [Top Navigation Bar & Mode Switcher](#6-top-navigation-bar--mode-switcher)
7. [Bottom Action Bar & Quick-Launch Hotkeys](#7-bottom-action-bar--quick-launch-hotkeys)
8. [Ballpoint & Technical Blueprint Aesthetic System](#8-ballpoint--technical-blueprint-aesthetic-system)
9. [Mobile Touch & Responsive Breakpoints](#9-mobile-touch--responsive-breakpoints)
10. [Implementation Roadmap & Code Integration Plan](#10-implementation-roadmap--code-integration-plan)

---

## 1. Core Objectives & Legacy Limitations

### 1.1 The Legacy Bottleneck
- **Cramped Flexbox Row**: The original map picker (`.mapsel`) placed text buttons in a single inline flexbox. With 7+ maps planned (Doodle District, Giant Classroom, Sketchpad Galaxy, Ink Seas, Clockwork Tower, Blueprint Castle, Zen Garden), this wraps into 3-4 awkward rows that push the "START MATCH" button, settings, and checkpoint selector completely off-screen on standard and mobile displays.
- **Zero Visual Identity**: Maps are currently represented only by uppercase names and short single-line blurbs, giving players no spatial impression of the verticality, hazards, or combat biomes before launching.
- **Disconnected Mode Selection**: Players pick modes on the main menu, then pick maps on a secondary sub-panel without an intuitive unified staging hub.

### 1.2 Modern Tactical Interface Goals
- **Unlimited Horizontal & Grid Scalability**: Implement an expansive card carousel and grid layout capable of hosting 10+ maps with zero layout breakage.
- **Tactical Mission Dossiers**: Feature rich map preview cards with blueprint illustrations, combat environmental tags (CQB, Sniping, Vertical Grapple), hazard warnings, and per-map player statistics.
- **Instant Deployment Flow**: Direct one-click or hotkey (`Space` / `Enter`) match launching with prominent visual confirmation.
- **Categorized Theater Filtering**: Organize maps into thematic operational sectors (e.g., *Urban Grounds*, *Colossal Arenas*, *Anomalous Realms*).
- **Aesthetic Integrity**: Express all tactical military shooter paradigms through ballpoint pen crosshatching, blue ruled notebook margins, rubber stamps, and drafting blueprint linework.

---

## 2. Tactical Interface Architecture

The modernized deployment interface adopts a full-screen tactical command layout composed of five harmonized structural zones:

```
+-----------------------------------------------------------------------------------+
|  [ZONE 1: TOP COMMAND BAR]                                                        |
|  DOODLE STRIKE // HQ    [ SURVIVAL ]   [ FREE ROAM ]   [ MULTIPLAYER ]   [SETTINGS] |
+-----------------------------------------------------------------------------------+
|  [ZONE 2: THEATER FILTER TABS]                                                    |
|  [ ALL THEATERS (7) ]   [ URBAN ]   [ COLOSSAL ]   [ ANOMALOUS ]   [ FAVORITES ]   |
+----------------------------------------------------+------------------------------+
|  [ZONE 3: HORIZONTAL DEPLOYMENT CAROUSEL / GRID]   | [ZONE 4: MISSION DOSSIER]    |
|                                                    |                              |
|  +--------------+ +--------------+ +-------------+ |  OPERATION: DOODLE DISTRICT  |
|  |  THUMBNAIL   | |  THUMBNAIL   | |  THUMBNAIL  | |  ==========================  |
|  |  SKETCH      | |  SKETCH      | |  SKETCH     | |  [BLUEPRINT SCHEMATIC]       |
|  |              | |              | |             | |                              |
|  | DISTRICT     | | CLASSROOM    | | GALAXY      | |  ENVIRONMENT: Urban Streets  |
|  | Urban CQB    | | Colossal     | | Zero-G Apex | |  ENGAGEMENT: CQB / Grapple   |
|  | Tier 1-3     | | Tier 1-4     | | Outer Space | |  HAZARDS: Lethal Abyss       |
|  +--------------+ +--------------+ +-------------+ |  BEST SCORE: 14,250           |
|                                                    |  CHECKPOINTS: Wave 5, 10, 15  |
+----------------------------------------------------+------------------------------+
|  [ZONE 5: BOTTOM ACTION BAR]                                                       |
|  [ESC] BACK TO HQ   |   [V] WEAPON LOCKER   |   [SPACE] DEPLOY TO MISSION         |
+-----------------------------------------------------------------------------------+
```

---

## 3. The Map Deployment Carousel & Tactical Cards

### 3.1 Card Geometry & Visual Anatomy
Each map is rendered as an interactive tactical deployment card (`.map-card`):
- **Card Proportions**: Width $240\text{px}$, Height $320\text{px}$ on desktop (auto-scaling to $190\text{px} \times 260\text{px}$ on medium screens).
- **Ink-Drawn Card Border**: Double-stroke ballpoint pen border (`border: 2.5px solid var(--ink)`) with subtle hand-drawn paper corner variances (`border-radius: 8px 12px 9px 11px`).
- **Interactive States**:
  - **Default**: $85\%$ opacity, blueprint paper background with light ruled faint graph lines.
  - **Hover**: Smooth lift (`transform: translateY(-6px) rotate(-0.5deg)`), ink shadow expansion, bold title highlight.
  - **Active / Selected**: Deep Prussian blue ink background (`background: var(--ink)`), crisp white text, bold red selection corner tape (`.tape-corner`).

### 3.2 Card Components
1. **Header Badge**: Operational theater index (e.g., `SEC-01`, `SEC-02`) and environmental icon.
2. **Ink Illustration Window**: Hand-drawn isometric thumbnail illustration of the map's signature landmark (e.g., District fire escapes, Classroom giant stapler, Galaxy Saturn V rocket, Sea galleon sails, Clockwork pendulum, Castle Donjon keep, Zen pagoda).
3. **Map Designation & Title**: Bold condensed sans-serif title in authentic ballpoint ink.
4. **Tactical Tags**: Three miniature metadata pill chips:
   - Combat Pace: `FAST CQB` / `LONG-RANGE` / `VERTICAL`
   - Scale: `MEDIUM` / `MASSIVE` / `TITANIC`
   - Atmosphere: `EARTH` / `SPACE` / `MARITIME` / `HOROLOGICAL`

---

## 4. Tactical Mission Dossier & Map Intel Panel

Stationed to the right of the card carousel on desktop (or below on tablet/mobile), the **Mission Dossier Panel** (`.mission-dossier`) provides comprehensive tactical intelligence for the currently selected theater:

### 4.1 Dossier Content Breakdown
- **Operational Header**: Stamped mission code (e.g., `MISSION: CHRONO SIEGE`, `THEATER: SECTOR 03`).
- **Blueprint Vector Wireframe**: High-contrast isometric schematic rendering of the level geometry with gridlines and elevation benchmarks.
- **Tactical Intel Specifications**:
  - **Terrain Archetype**: Brief architectural overview (e.g., "Triple-story stone keep with moat and sally ports").
  - **Verticality Index**: Elevation delta (e.g., `Elevation: -4m to +32m (5 Tiers)`).
  - **Key Structural Features**: Bulleted breakdown of major interactive set-pieces (e.g., "Swinging 40m Pendulum", "Kinetic Monorail Crane", "Reciprocating Piston Rams").
  - **Lethal Hazards**: Warning callout with red diagonal hatching (e.g., `WARNING: Grinding Cogwheel Abyss below Y=-4.0m`).
- **Deployment Records & Checkpoints**:
  - Personal Best Score and Highest Wave Survived.
  - Interactive checkpoint wave selector buttons (`Wave 5`, `Wave 10`, `Wave 15`, etc.).

---

## 5. Theater Categories & Filtering System

To ensure seamless navigation as the roster expands, maps are organized into intuitive categorical filters:

| Category ID | Filter Label | Included Theaters | Thematic Focus |
| :--- | :--- | :--- | :--- |
| `all` | **ALL THEATERS** | All 7+ Maps | Complete catalog view |
| `urban` | **TACTICAL GROUNDS** | Doodle District, Blueprint Castle | Cobblestones, alleyways, ramparts, close-quarters combat |
| `colossal` | **COLOSSAL SIZES** | The Giant Classroom, The Ink Seas | Gigantic desk props, dual full-scale warships, high vertical traversal |
| `anomalous` | **ANOMALOUS LABS** | Sketchpad Galaxy, Clockwork Tower, Zen Garden | Low gravity, kinetic clock machinery, serene temple sanctuaries |
| `favorites` | **STARRED MISSIONS** | User-Saved Favorites | Quick-access custom playlist stored in `localStorage` |

---

## 6. Top Navigation Bar & Mode Switcher

The top navigation strip (`.tactical-top-bar`) unifies mode selection directly into the deployment screen:
- **Game Mode Segmented Control**:
  - `[SURVIVAL]`: Solo wave endurance mode with checkpoint jumping.
  - `[FREE ROAM]`: Combat-free exploration of map geometry and grapple parkour.
  - `[MULTIPLAYER]`: Quick Play matchmaking and custom lobby creation.
- **Player Callout**: Displays current callsign (editable inline with pencil icon) and active input device indicator (Mouse & Keyboard / Gamepad / Touch).
- **Settings Quick-Access**: Direct link to Audio, Graphics, Camera, and Mobile controls.

---

## 7. Bottom Action Bar & Quick-Launch Hotkeys

A high-visibility bottom docking strip (`.deployment-action-bar`) anchors primary player inputs:
- **Primary Deployment CTA (`#deployBtn`)**:
  - Oversized high-contrast ink button: `DEPLOY TO [SELECTED MAP]`.
  - Sub-label indicating mode: `SOLO WAVE SURVIVAL · START AT WAVE 1`.
  - Global Hotkey: `Space` or `Enter`.
- **Secondary Action Controls**:
  - `[V] WEAPON LOCKER`: Opens the 3D spinning weapon inspection showcase.
  - `[ESC] HEADQUARTERS`: Returns to the clean start screen.
  - `[C] CHECKPOINTS`: Toggles wave checkpoint jump tray.

---

## 8. Ballpoint & Technical Blueprint Aesthetic System

The entire tactical interface is rendered using the established notebook ink design language:

- **Graph & Ruled Paper Backgrounds**:
  - Primary menu canvas uses faint blue quadrille grid lines (`16px` pitch) on aged drawing parchment (`var(--paper)`).
  - Left margin accented by a double red ballpoint margin line (`var(--red)`).
- **Tactical Ink Rubber Stamps**:
  - "MISSION APPROVED", "TOP SECRET", and "HOST PRIVILEGES" stamps rendered with imperfect rotated stencils and ink speckles.
- **Stationery Accents**:
  - Selected cards feature hand-drawn masking tape corners in soft stationery pink (`INK.PINK`) or drafting cyan.
- **Audio Feedback Triggers**:
  - Card Hover: Crisp paper shuffle rustle (`audio.click()`).
  - Card Selection: Heavy rubber stamp thud (`audio.hit()`).
  - Deploy Match: Mechanical fountain pen snap and mission buzzer.

---

## 9. Mobile Touch & Responsive Breakpoints

### 9.1 Desktop Ultrawide & Standard (`> 1024px`)
- Side-by-side layout: Horizontal card carousel (65% width) + Detailed Mission Dossier (35% width).
- Mouse wheel enables horizontal scrolling across the card strip.

### 9.2 Tablet & Small Desktop (`768px - 1023px`)
- Mission Dossier transitions to a compact summary card positioned directly below the carousel.
- Carousel displays 3 visible cards at a time with smooth swipe/drag navigation.

### 9.3 Mobile Phones & Compact Screens (`< 768px` / Landscape `< 650px` height)
- **Compact Card Strip**: Card dimensions adjust to $160\text{px} \times 220\text{px}$ with touch-snap alignment (`scroll-snap-type: x mandatory`).
- **Collapsible Dossier**: Tactical dossier collapses into an expandable accordion drawer to prevent vertical viewport overflow.
- **Sticky Deployment Bar**: Primary "DEPLOY" button docks to the screen bottom with full touch hit-box ($\ge 48\text{px}$ touch target).

---

## 10. Implementation Roadmap & Code Integration Plan

To maintain modularity and avoid monolithic growth, the enhancement will be executed safely across focused layers:

1. **Phase 1: Structure & Styles (`style.css`)**:
   - Introduce `.tactical-top-bar`, `.map-carousel`, `.map-card`, `.mission-dossier`, and `.deployment-action-bar`.
   - Add `.panel.tactical-layout` to safely expand the `#panel` bounds without breaking Settings/Lobby screens.
2. **Phase 2: UI Generation & Logic (`src/hud.js` & `src/main.js`)**:
   - Create a dedicated `tacticalMapSelectHTML()` (leaving multiplayer `lobbyHTML` alone to prevent overflow).
   - Expand `LEVELS` metadata with tactical tags, hazard warnings, and thumbnail icon keys.
   - Wire horizontal arrow-key navigation, wheel scrolling, and category filter switching while preserving exact `id` and `data-cp` tags.
3. **Phase 3: Integration with Multiplayer Lobby (`src/main.js`)**:
   - Use a condensed `.map-card` strip inside the lobby, preserving space for player lists and chat.

## 11. Engineering Safety & Mitigations
- **Lobby Decoupling**: The tactical menu will NOT overwrite `mapHTML()` directly for all screens. It uses a bespoke rendering function to protect the Multiplayer Lobby layout.
- **Modal Container Expansion**: A contextual `.tactical-layout` class will be applied to the `#panel` to safely bypass the `90vw` legacy limits, reverting automatically when leaving the screen.
- **Event Preservation**: All new UI buttons will retain legacy HTML IDs (e.g., `#startBtn`, `data-cp`) to guarantee existing click-handlers in `src/main.js` remain perfectly functional without JS refactoring.
- **Mode State Routing**: Mode buttons (`[SURVIVAL]`, `[FREE ROAM]`) will be wired to mutate `game.mode` and call `showStart()` to maintain the game's strict state machine.

## 12. Landscape Mode Enforcement
To ensure the expansive tactical menu and gameplay function flawlessly, portrait orientation is strictly forbidden on mobile:
- **CSS Orientation Block**: A full-screen overlay (`#landscape-blocker`) will trigger via `@media (orientation: portrait) and (max-width: 900px)`. It will blur the background, hide the UI, and display a bold "Please Rotate Your Device to Landscape" warning.
- **Screen Orientation API**: Where supported (Android/Modern Web), the game will invoke `screen.orientation.lock('landscape')` during startup to force the rotation automatically.
