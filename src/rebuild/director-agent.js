// src/rebuild/director-agent.js
// LLM Orchestration Layer & Stand-in Director for Dream Rebuild
// Replaces the mock creative debate with an AST-planning protocol and deterministic Stand-in Director.

import { createNode, NODE_TYPES, validateL1Schema } from './scene-tree-schema.js';
import { buildSurfaceGridFromTree } from './surface-grid.js';
import { validateGameplay } from './validation-engine.js';

/**
 * Common Director Agent Interface.
 * All directors (LLM or Stand-in) output typed proposals, never raw JavaScript code.
 */
export class DirectorAgent {
  /**
   * @param {object} context - { tree, metrics, agenda, theme, seed }
   * @returns {Promise<Array<{ kind: string, ...params }>>}
   */
  async propose(context) {
    throw new Error('propose() must be implemented by subclass');
  }
}

/**
 * Deterministic Stand-in Director (zero-LLM, offline fallback).
 * Acts as a competent rule-based architect, set dresser, and gameplay auditor.
 */
export class StandinDirector extends DirectorAgent {
  async propose(context) {
    const { tree, agenda, theme } = context;
    const proposals = [];

    // Auditor Reflex: If high-severity deficiencies exist, propose fixes
    if (agenda && agenda.length > 0) {
      for (const def of agenda) {
        if (def.severity >= 0.7) {
          proposals.push({
            kind: 'prescription',
            prescription: def.prescription
          });
        }
      }
    }

    // Set Dresser Reflex: If tree has rooms lacking decoration, propose prop instances
    const rooms = tree.nodes.filter(n => n.type === NODE_TYPES.ROOM);
    for (const room of rooms) {
      const hasProps = tree.nodes.some(n => n.tags?.zone === room.id && n.type === NODE_TYPES.PROP_INSTANCE);
      if (!hasProps) {
        proposals.push({
          kind: 'addNode',
          node: createNode(`dress_${room.id}`, NODE_TYPES.COVER_BLOCK, {
            x: room.transform.x,
            y: room.transform.y,
            z: room.transform.z,
            w: 1.4, h: 1.2, d: 0.6
          }, {}, { ink: 'OR', zone: room.id })
        });
      }
    }

    // Cousin-Substitution Reflex: If unknown asset or theme gap reported in context
    if (context.assetGap) {
      const cousin = this.findCousinAsset(context.assetGap, theme);
      proposals.push({
        kind: 'cousinStandin',
        requestedAsset: context.assetGap,
        substitutedAsset: cousin.id,
        confidence: 0.5,
        note: `Substituted nearest cousin asset "${cousin.id}" to prevent generation halt.`
      });
    }

    return proposals;
  }

  /**
   * Finds nearest known cousin asset by tag overlap or fallback.
   */
  findCousinAsset(assetId, theme = 'general') {
    const fallbackCatalog = [
      { id: 'parametric_tree', tags: ['tree', 'nature', 'flora', 'forest', 'organic'] },
      { id: 'curved_hollow_log', tags: ['log', 'tunnel', 'cover', 'corridor'] },
      { id: 'boulder_field', tags: ['rock', 'stone', 'boulder', 'cover'] },
      { id: 'crate_stack', tags: ['crate', 'box', 'cover', 'cargo'] },
      { id: 'sandbag_row', tags: ['sandbag', 'barricade', 'cover'] }
    ];

    const searchStr = `${assetId} ${theme}`.toLowerCase();
    let bestMatch = fallbackCatalog[0];
    let maxScore = -1;

    for (const item of fallbackCatalog) {
      let score = 0;
      for (const tag of item.tags) {
        if (searchStr.includes(tag)) score += 2;
      }
      if (score > maxScore) {
        maxScore = score;
        bestMatch = item;
      }
    }

    return bestMatch;
  }
}

/**
 * Generates a structured Markdown prompt packet for offline consultation with any frontier LLM.
 * Supports standard AST Consultation or Field Guide Teaching Packet.
 */
export function generatePromptPacket(tree, report, theme = 'space_station', options = {}) {
  if (options.teachRequest) {
    const tr = options.teachRequest;
    return [
      `# DREAM FIELD GUIDE TEACHING PACKET: ${tr.ticketId}`,
      `Asset: "${tr.trigger.assetId}" | Theme: "${tr.trigger.theme}"`,
      `Paused Scope: ${tr.trigger.pausedScope}`,
      '',
      `## 1. MEASURED CONTEXT (The Apprentice's Homework)`,
      `- Available Footprint: ${JSON.stringify(tr.trigger.measuredContext.footprintAvailable)} meters`,
      `- Headroom to Obstruction: ${tr.trigger.measuredContext.headroomToObstruction}m`,
      `- Needed Tactical Roles: ${tr.trigger.measuredContext.neededTacticalRoles.join(', ')}`,
      `- Geometry Budget Remaining: ${tr.trigger.measuredContext.geometryBudgetLeft} calls`,
      '',
      `## 2. CANONICAL QUESTIONS`,
      ...tr.questions.map(q => `- **${q.id}**: ${q.text}`),
      '',
      `## 3. INSTRUCTIONS FOR THE TEACHER`,
      `Please provide a valid declarative JSON object conforming to \`dream-recipe/1.0\`:`,
      '```json',
      `{`,
      `  "schema": "dream-recipe/1.0",`,
      `  "id": "${tr.trigger.assetId}",`,
      `  "version": 1,`,
      `  "provenance": { "teacher": "field_guide", "date": "${new Date().toISOString().slice(0, 10)}" },`,
      `  "params": { ... },`,
      `  "parts": [ ... ],`,
      `  "anchors": { ... },`,
      `  "tactical": { "roles": ${JSON.stringify(tr.trigger.measuredContext.neededTacticalRoles)} }`,
      `}`,
      '```'
    ].join('\n');
  }

  const compactNodes = tree.nodes.map(n => ({
    id: n.id,
    type: n.type,
    pos: [n.transform.x, n.transform.y, n.transform.z],
    dim: [n.transform.w, n.transform.h, n.transform.d]
  }));

  return [
    `# DREAM CONSULTATION PACKET: ${tree.map.toUpperCase()}`,
    `Theme: ${theme} | Seed: ${tree.seed} | Strategy: ${tree.strategy}`,
    `Validation Score: ${report.score}/100 | Passed: ${report.passed}`,
    '',
    `## CURRENT DEFICIENCIES`,
    ...report.deficiencies.map(d => `- [${d.metric}] Severity ${d.severity}: ${d.message}`),
    '',
    `## SCENE TREE AST (COMPACT)`,
    '```json',
    JSON.stringify(compactNodes, null, 2),
    '```',
    '',
    `## INSTRUCTIONS FOR LLM ARCHITECT`,
    `Please respond strictly with a JSON array of AST Proposals:`,
    `[`,
    `  { "kind": "addNode", "node": { "id": "...", "type": "coverBlock", ... } },`,
    `  { "kind": "removeNode", "nodeId": "..." }`,
    `]`
  ].join('\n');
}

/**
 * Validates and merges proposals into a Scene Tree if and only if they improve or maintain score.
 */
export function applyDirectorProposals(tree, proposals) {
  const cloned = JSON.parse(JSON.stringify(tree));
  const preGrid = buildSurfaceGridFromTree(cloned);
  const preScore = validateGameplay(cloned, preGrid).score;

  for (const prop of proposals) {
    if (prop.kind === 'addNode' && prop.node) {
      cloned.nodes.push(prop.node);
    } else if (prop.kind === 'removeNode' && prop.nodeId) {
      cloned.nodes = cloned.nodes.filter(n => n.id !== prop.nodeId);
    }
  }

  // Validate L1
  const l1 = validateL1Schema(cloned);
  if (!l1.valid) {
    return { applied: false, reason: `L1 schema failure: ${l1.errors.join(', ')}`, tree };
  }

  // Verify score did not degrade
  const postGrid = buildSurfaceGridFromTree(cloned);
  const postReport = validateGameplay(cloned, postGrid);

  if (postReport.score < preScore) {
    return { applied: false, reason: `Proposal degraded score from ${preScore} to ${postReport.score}`, tree };
  }

  return { applied: true, tree: cloned, postScore: postReport.score };
}
