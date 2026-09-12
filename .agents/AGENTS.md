# Project Guidelines: Auto-Push to GitHub

Whenever you complete changes, bug fixes, or enhancements in this repository, you must automatically stage, commit, and push the changes to GitHub.

## Rules
1. Always run git status and check diffs before committing.
2. Commit with clean, descriptive commit messages following conventional commits (e.g., `feat: ...`, `fix: ...`, `refactor: ...`).
3. Always push to the remote repository on `main` branch (`git push origin main`).
4. Keep the repository clean and ensure all tests/syntax checks pass before pushing.

## Architecture Guardian & Disaster Recovery (Sanctuary & Immutability)
- **STRICT SANCTUARY**: Under NO circumstances are any agents permitted to edit, modify, delete, or overwrite `.agents/skills/doodle-strike-architect/`. This is a permanent, immutable safe space representing the verified Golden Baseline.
- As updates and features are developed and stabilized in the future, **NEVER** overwrite this baseline.
- A new version (e.g. `doodle-strike-architect-2.0`) may **ONLY** be created when the developer explicitly commands: *"lets create another architect"*, and it must be created as a completely separate versioned package without altering or replacing version 1.0.
- For all architectural decisions, module structures, enemy AI, environment generation, and rendering math, follow `.agents/skills/doodle-strike-architect/SKILL.md`.
- In case of a fatal build failure, regression, or corruption, immediately run:
  `node .agents/skills/doodle-strike-architect/scripts/verify-integrity.js`
- Golden Baseline Snapshot: `01541ad` (`git reset --hard 01541ad` if fatal recovery is required).

## Universal Mesh & Object Detailing Standard (Mandatory for All Maps)
- For all mesh, object, skeletal, prop, and environment detailing across any current or future maps, follow `.agents/skills/universal-detailing-standard/SKILL.md` and `.agents/rules/universal-detailing.md`.
- The detailing standard is graphics-quality agnostic and enforces the Skeleton-Skin-Trim triad, material-to-ink mapping, and the 0.3m detail threshold.
- **Intent Interpretation for All Agents**:
  - **CHECK / AUDIT ("check", "audit", "verify", "inspect", "are there bugs/issues")**:
    - If inspecting code/physics: Run `npm run audit:map <map>` (`verify-detailing.js`).
    - If inspecting concept doc: Run `npm run audit:concept <concept>` (`audit-concept.js`) to verify all 13 sections, Tier 1-4 prop taxonomy, stair rise/run math, and 1.8m anti-pinch clearances.
  - **BUILD / IMPLEMENT ("build", "create", "upgrade", "detail", "add props")**: Build using the Skeleton-Skin-Trim triad, 0.3m threshold (`noCollide: true` on trim), and run verify-detailing before completing.
  - **BRAINSTORM / CONCEPT DIVERSIFICATION ("brainstorm", "enhance concept", "add elements to concept", "improve concept", "give me ideas")**:
    - **Creative Notebook-Ballpoint Anchoring**: Ground all brainstormed elements in authentic ballpoint/drafting stationery metaphors (erasers, set-squares, drafting tape, ink wells, paper clips) combined with monumental architectural themes.
    - **Tier 1-4 Thematic Taxonomy**: Must specify objects across all 4 tiers (Tier 1 Cover Props, Tier 2 Tactical Furniture/Walkways, Tier 3 Landmark Anchor Props, Tier 4 Hero Multi-Story Set Pieces).
    - **Sector Densification Guarantee**: Prevent empty spaces by mandating intermediate staging clutter, cryo/fuel tanks, tool racks, berms, and multi-tier catwalk crossings in every quadrant.
    - **Stairway & Landing Standard**: Specify exact step rise ($0.25-0.28\text{m}$), step run ($0.45-0.50\text{m}$), intermediate rest landings for every $4\text{m}$ vertical rise, and $3.0\text{m}$ continuous vertical headroom.
- To verify compliance across maps and concepts, run:
  `npm run audit:map [mapKey]` AND `npm run audit:concept [conceptName]`

## Universal Map Registration & Linkage Standard
Whenever a new map is created, promoted, or added to the game:
1. **LEVELS Entry (`src/level.js`)**: Must define `key`, `name`, `category` ('urban'|'colossal'|'anomalous'), `tags`, `env`, `engagement`, `hazard`, and `scale`. If still in development, set `comingSoon: true`.
2. **MAP_BUILDERS Registry (`src/level.js`)**: When playable, register the builder function in `MAP_BUILDERS` (or via `registerMapBuilder(key, fn)`).
3. **Map Blueprint & Thumbnails (`src/main.js`)**: In `getMapSVG(key, isDossier)`, provide SVG visuals for thumbnail and 200x100 blueprint dossier views.
4. **Crash-Safe Deploy Button**: If a map has `comingSoon: true`, the UI automatically displays "MISSION IN DEVELOPMENT" and locks the start button to prevent game-loop crashes.
5. **Universal Detailing Audit**: Run `npm run audit:map <mapKey>` (or `all`) to guarantee that all colliders, spawns, pickups, and grapple clearances meet quality score ≥ 7.0.






