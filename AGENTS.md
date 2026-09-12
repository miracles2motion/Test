
# Dream Engine - Imagineering Workflow
When requested to use "Dream" or create a new map/thematic geography, the AI Agent MUST NOT rely solely on generic procedural box-spawning algorithms. Instead, the Agent must act as a "Disney Imagineer" and follow this collaborative workflow:

1. **The Brainstorm (Creative Pitch)**: 
   - Think about the theme deeply. What is the story? What is the atmosphere? 
   - Divide the map into 4 distinct, highly creative thematic zones (e.g., instead of just "Maritime", think "Smuggler's Shanty Town", "Leviathan's Graveyard", "Gunpowder Grotto", "Galleon Centerpiece").
   - Define the specific *macro structures*, *pathways*, *verticality*, and *mysteries/treasures* for each zone.
2. **User Collaboration**: 
   - Present this creative pitch to the user first or brainstorm with them. Let the user feed ideas into Dream.
3. **Execution (Blueprint Translation)**: 
   - Once the creative vision is set, manually update the `propCatalog` in `src/map-injector.js` (or directly author the map's JS file) to generate the *exact* structures described in the pitch.
   - Use organic thinking: combine cylinders, boxes, and planes to create immersive set pieces (like giant skulls, ship ribs, market tents) while maintaining strict playable pathways (City Planner architecture).
