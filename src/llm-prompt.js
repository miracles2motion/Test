/**
 * Doodle Strike - Spatial JSON Prompt Builder
 * 
 * Dynamically constructs the prompt that forces the LLM to output
 * valid Spatial JSON for Dream's orchestrator to consume.
 */

import { SPATIAL_JSON_SCHEMA } from './spatial-schema.js';

export function buildSpatialPrompt(userRequest, mapContext = {}, learningCache = {}) {
  const schemaString = JSON.stringify(SPATIAL_JSON_SCHEMA, null, 2);
  
  return `
You are the Spatial Architect for Project Dream, an autonomous level design AI.

## YOUR TASK
Convert the following natural language request into a strictly typed Spatial JSON blueprint.

## USER REQUEST
"${userRequest}"

## CURRENT MAP CONTEXT
- Existing regions: ${JSON.stringify(mapContext.existingRegions || [])}
- Available space: ${JSON.stringify(mapContext.availableBounds || {})}
- Theme: ${mapContext.theme || 'unspecified'}
- Current flow score: ${mapContext.currentFlowScore || 0}/100

## LEARNED PREFERENCES (from past generations)
- Successful patterns: ${JSON.stringify(learningCache.successPatterns || [])}
- Dead zones to avoid: ${JSON.stringify(learningCache.deadZones || [])}

## CRITICAL RULES
1. Output ONLY valid JSON matching the Spatial JSON Schema below. Do not wrap it in markdown code blocks. No prose, no conversation.
2. All coordinates are in meters. Y is up. Origin is map center.
3. Every region MUST connect to at least 2 other regions (no dead ends).
4. Spawn points MUST have 'protection: full' or 'protection: partial'. Never 'exposed'.
5. Sniper positions MUST have at least 2 entry/exit connections.
6. Grapple points MUST be within 18m of at least one other grapple point or walkable surface.
7. For organic terrain, use the 'terrain' field with voxel operations and lsystem instances.
8. Cover nodes should follow combat rhythm: one hard cover every ~32m, one soft cover every ~16m.

## SCHEMA REFERENCE
${schemaString}

## OUTPUT
`;
}
