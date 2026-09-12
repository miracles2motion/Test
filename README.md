# Doodle Shooter - Doodle District

A first-person survival shooter drawn in blue ballpoint on lined notebook paper. Grapple across rooftops and canyons, slice bullets back at the doodles that fired them, lob grenades, and see how many waves you can survive. Play alone, survive with friends, or fight them.

**Live Demo:** https://doodleshooter-kappa.vercel.app/

Everything you see is generated in code with three.js. There are no models, textures or sound files: the paper, the ink outlines, the hatching, the enemies and the music are all procedural, including the 8-bit themes, one per map (toggle them in settings or with M).

## Running it

It is a static site, so any web server works. Locally:

```bash
python3 serve.py 8910
```

then open http://127.0.0.1:8910. On Vercel (or any static host) just deploy the folder as is.

**Vercel Deployment:** The project is deployed at https://doodleshooter-kappa.vercel.app/ - just push to main and Vercel auto-deploys.

## Modes

- **Solo**: survive the waves. Bosses every fifth wave, checkpoints unlock at wave 5, 10, 15...
- **Free for all**: up to ten players, first to 20 kills, with a ten minute cap shown on screen that starts once a second player is in. Anyone in the lobby can start. After the death cam a press of any button brings you back with a two second shield; two and a half minutes without input gets you kicked, with a one-click rejoin. Health regenerates after a few seconds out of combat (not while sprinting), so only ammo drops in.

Multiplayer is peer-to-peer over WebRTC (PeerJS), so it works from a static host with no game server. Under PLAY ONLINE you can Quick Play (joins an open public lobby, or opens one for you), create a public or private lobby, or join a friend's lobby with their five letter code. People can join a match already in progress. The host's browser keeps score; each player runs their own body.

## Controls

### Desktop - Mouse + Keyboard
| Action | Key |
| --- | --- |
| Move / look / sprint | WASD, mouse, Shift |
| Fire / slash | LMB |
| Aim / block (katana) | RMB |
| Jump, wall jump, double jump | Space |
| Slide, air dash | C / Ctrl |
| Grapple (hold to reel) | Q / E |
| Quick katana slash | F |
| Reload | R |
| Grenade (hold to throw further) | G |
| Katana dash (gauge lit) | Both mouse buttons or X |
| Weapons | 1-4 / wheel |
| Scoreboard (online) | Tab |
| Menu | Esc |

### PS5 Controller
| Action | Button |
| --- | --- |
| Move / look / sprint | L stick, R stick, L3 |
| Fire / slash | R2 |
| Aim / block | L2 |
| Jump | ✕ |
| Slide, air dash | ○ |
| Grapple | L1 |
| Quick katana | R1 |
| Reload | □ |
| Grenade | R3 or D-pad up |
| Katana dash | L2 + R2 |
| Weapons | △, D-pad |
| Scoreboard | Create |
| Menu | Options |

### 📱 Touch / Tactical Mobile (New!)
Optimized for mobile with tactical handheld shooter layout:

- **Left Joystick** (18% from left/bottom): Move - drag direction, release to stop. Fluid follow, scales with UI scale setting.
- **Right Half Screen Drag**: Look around - drag anywhere on right 62% of screen for fluid camera control. **Fixed: Y-axis no longer inverted - drag up = look up.**
- **🔫 FIRE Button** (right 4%, bottom 8%): Big red circular button - fire / slash. Designed for natural right thumb rest zone.
- **◎ AIM Button**: Aim / block - right 5%, bottom 26%
- **JUMP / SLIDE / SPRINT**: Thumb-accessible buttons - JUMP (right 22% bottom 32%), SLIDE, SPRINT, DASH
- **GRAPPLE / GRENADE / KATANA**: Action buttons - GRAPPLE (right 4% bottom 42%), GRENADE, KATANA
- **1-4 Weapon Switch**: Bottom center (42-60% left, 6% bottom) - quick weapon swap
- **Auto-detects touch devices** - no mouse lock needed on mobile
- **Customizable Layout**: Settings → Customize Layout - drag any button anywhere (% based responsive), scale individually, save to localStorage (`doodle_mobile_settings`). Includes global scale slider (60-150%).
- **Toggle**: Settings → Touch controls checkbox to enable/disable. Hidden by default on desktop (pointer: fine), auto-enabled on touch devices.

On-screen hints follow whichever device you touched last.

**Start Screen Optimization:** Controls help is now hidden by default behind a "🎮 Show Controls / Help" button to save vertical space on mobile. Click to expand/collapse. Panel is scrollable (max-height 92vh) with optimized font sizes for mobile.

## Weapons and gear

Rifle, shotgun, sniper (with scope) and a katana. Holding block with the katana parries some incoming bullets and returns a share of them. Katana kills charge a gauge; when it is lit you can dash to a marked enemy and execute it (solo only). Grenades bounce, then go off in a thick orange blast that scorches the paper; holding the button winds up a longer throw and shows the arc. The grapple runs on breath: hanging drains it, landing refills it, and a slash through someone's rope cuts it. Against other players a raised katana parries slashes and turns some bullets aside, and the guns use their own damage table; the sniper still erases in one shot.

## Maps

- **Doodle District**: streets, rooftops and fire escapes, with grapple rings on the high spots. Solo plays the tight original block. A match opens it up: a ring of empty street, walls, a ribbed dome that cannot be hooked, an open field in the middle crossed by a ruler bridge, a few pads hung from the dome, and slow paper planes you can hook and ride (the solo planes too).
- **Doodle Mexico**: a sun-baked pueblo. A plaza with a fountain and a giant sombrero floating over it, a bandstand where three mariachis never stop playing, a church with a bell tower you can climb and a domed second tower, adobe houses with roof stairs, papel picado strung across the square, a market of striped stalls and hanging piñatas, a taco cart, cacti and mesas all around. Pots, crates, barrels, cacti and piñatas all break under bullets, blades and blasts; piñatas drop tacos, which are the health pickups here. The map plays its own mariachi waltz.

Pick the map on the main menu for solo; the host picks it in the lobby for a match, and everyone starts in a different spot.

## Enemies

- **Grunt** - Basic rifle enemy
- **Rusher** - Fast melee charger
- **Heavy** - Shotgun tank
- **Sniper** - Long-range with dodgeable lasers
- **Shieldbearer** - Shielded pistol enemy
- **Ink Bomb** - Explosive bomber
- **Paper Wasp** - Flying diver
- Bosses rotate: **The Doodler**, **The Eraser** and **The Inkblot**, each with its own moves.

## How the look works

The scene renders to a buffer holding shade, an ink id and view-space normals plus a float depth. A post pass draws outlines from an inverse-depth Laplacian, adds surface-following hatching, paper grain, ruled lines and the red margin. Wobble is static so nothing flickers.

## Recent Updates

### v3 - English + Mobile Fix (Latest)
- **Purely English** - Removed all Chinese strings, fully translated HUD, menus, tips, messages, enemy names, level names
- **Camera Inverted Fix** - Fixed touch look Y-axis: dragging up now correctly looks up (was inverted). Changed `lookVector.y += dy` to `lookVector.y -= dy` in `mobile.js`
- **Collapsible Controls** - Controls explanation hidden by default on main menu and pause menu, behind "🎮 Show Controls / Help" toggle button to save vertical space on mobile
- **Mobile Start Screen Optimization** - Panel now max-height 92vh, scrollable, optimized font sizes, reduced gaps for mobile viewport
- **Vercel Deployment** - Live at https://doodleshooter-kappa.vercel.app/

### v2 - Toggle + Customizable Layout
- Touch controls toggle in settings (enable/disable)
- Global UI scale slider (60-150%)
- Customize Layout button - drag any button anywhere, per-button scale, saved to localStorage
- Edit mode overlay with visual feedback

### v1 - Tactical Mobile Controls
- Initial mobile touch controls with joystick, fire button, action buttons, weapon slots
- Auto-detect touch devices, no pointer lock needed
- Fluid tactical mobile ergonomics (% based positioning)

---

## 🎨 Universal Map Detailing Standard (AI Agent Directives)

This repository enforces a mandatory **Universal Mesh & Object Detailing Standard** for all existing, newly created, or conceptual maps. Any AI or developer building or checking maps must adhere to:
* **Skill Guide:** [`.agents/skills/universal-detailing-standard/SKILL.md`](.agents/skills/universal-detailing-standard/SKILL.md)
* **System Rule:** [`.agents/rules/universal-detailing.md`](.agents/rules/universal-detailing.md)

### 🗣️ Quick Agent Command Prompts

You can tell any AI or agent to either **CHECK** or **BUILD** a map using these natural triggers:

#### 1. CHECK / AUDIT Commands
* **Audit a Coded Map:**
  > *"Check the [Map Name] map against the Universal Detailing Standard."*
  > Or run: `node .agents/skills/universal-detailing-standard/scripts/verify-detailing.js [mapKey]`
* **Audit an Unbuilt Concept:**
  > *"Audit the concept document for [Map Name] against the Universal Detailing Standard before we code it."*
* **Audit All Maps:**
  > *"Audit all maps with the detailing verifier."*
  > Or run: `node .agents/skills/universal-detailing-standard/scripts/verify-detailing.js all`

#### 2. BUILD / CREATE Commands
* **Build a New Map from Scratch:**
  > *"Build [Map Name] following the Universal Detailing Standard in `SKILL.md`."*
* **Detail an Existing Map:**
  > *"Upgrade the object detailing on [Map Name] to meet the Universal Detailing Standard."*

#### 3. BRAINSTORM & THEMATIC OBJECT IDEATION Commands
* **Brainstorm New Map Themes:**
  > *"Brainstorm 3 new map concepts for Doodle Strike following the Universal Detailing Standard."*
* **Brainstorm Thematic Objects & Props for a Map:**
  > *"Brainstorm thematic objects, props, and landmarks that suit [Map Name]. Give me ideas across Tiers 1 through 4."*
* **Develop Chosen Concept into Design Doc:**
  > *"Write a complete concept document for [Selected Idea] into `map_concepts/`."*

When given these commands, the agent will automatically apply the 7 construction tiers, Skeleton-Skin-Trim triad, 0.3m detail threshold (`noCollide` on micro-trim), 1.8m anti-pinch corridors, flush stair landings with 3.0m headroom, and zero dynamic allocations in animations.

---

## 🗺️ Map Registration & Selector Linkage Guide

When adding or promoting a new map into Doodle Strike, follow this 4-step checklist to ensure it appears in the tactical map selector without crashes:

1. **Register in `src/level.js` (`LEVELS` array)**:
   Add map metadata:
   ```javascript
   {
     key: 'my_map',
     name: 'MY MAP TITLE',
     blurb: 'brief description of the map',
     category: 'urban' | 'colossal' | 'anomalous',
     tags: ['FAST CQB', 'MEDIUM', 'EARTH'],
     env: 'Visual Environment',
     engagement: 'CQB / Sniping / Grapple',
     hazard: 'Lethal Abyss / None',
     scale: 'Tier 1-4',
     comingSoon: false // set to true if not yet playable
   }
   ```
2. **Register Builder in `src/level.js` (`MAP_BUILDERS`)**:
   Add your builder function to `MAP_BUILDERS` (or call `registerMapBuilder('my_map', buildMyMap)`).
3. **Add Map Artwork in `src/main.js` (`getMapSVG`)**:
   Add SVG paths for both the thumbnail carousel and the 200x100 wireframe blueprint dossier. (A crash-proof procedural fallback is automatically provided if omitted).
4. **Audit and Verify**:
   Run `npm run audit:map all` and `npm run verify:integrity` to confirm all colliders, spawns, grapple clearances, and selector hooks pass.



