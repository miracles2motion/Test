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

    return proposals;
  }
}

/**
 * Generates a structured Markdown prompt packet for offline consultation with any frontier LLM.
 */
export function generatePromptPacket(tree, report, theme = 'space_station') {
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
