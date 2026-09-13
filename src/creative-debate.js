/**
 * Doodle Strike - Creative Debate Engine
 * Pits an Art Director persona against a Lead Level Designer persona to negotiate
 * a map layout that is both visually stunning and tactically flawless.
 */

export class CreativeDebateEngine {
  constructor(llmClient) {
    this.llm = llmClient; // In production, this calls OpenAI/Anthropic APIs
    this.maxRounds = 5;
    this.convergenceThreshold = 0.85; // Stop when 85% agreement is reached
  }

  async generateMap(userRequest, mapContext) {
    let artDirectorVision = null;
    let levelDesignerAudit = null;
    let currentBlueprint = null;
    const debateLog = [];

    console.log(`\n=== INITIATING CREATIVE DEBATE ===\nUser Request: "${userRequest}"\n`);

    for (let round = 1; round <= this.maxRounds; round++) {
      console.log(`[DEBATE] Round ${round}/${this.maxRounds}`);

      // --- ART DIRECTOR PHASE ---
      console.log(`   🎨 Art Director is dreaming...`);
      artDirectorVision = await this.mockArtDirectorLLM(userRequest, levelDesignerAudit, round);

      // --- LEVEL DESIGNER PHASE ---
      console.log(`   📐 Level Designer is auditing...`);
      levelDesignerAudit = await this.mockLevelDesignerLLM(artDirectorVision, round);

      currentBlueprint = levelDesignerAudit.blueprint;
      
      const agreement = this.computeAgreement(artDirectorVision.blueprint, levelDesignerAudit.blueprint);
      
      debateLog.push({
        round,
        artDirectorChanges: artDirectorVision.changes,
        levelDesignerFixes: levelDesignerAudit.fixes,
        agreementScore: agreement
      });

      console.log(`   ⚖️  Agreement Score: ${(agreement * 100).toFixed(0)}%`);

      // --- CONVERGENCE CHECK ---
      if (agreement >= this.convergenceThreshold) {
        console.log(`\n✅ [DEBATE CONVERGED] Blueprint finalized at Round ${round}!`);
        break;
      }

      // --- ESCALATION ---
      if (round === this.maxRounds - 1 && agreement < 0.6) {
        console.log(`\n🚨 [DEADLOCK DETECTED] Invoking Creative Director to break tie...`);
        currentBlueprint = await this.mockCreativeDirectorLLM(userRequest, artDirectorVision.blueprint, levelDesignerAudit.blueprint);
        break;
      }
    }

    return {
      blueprint: currentBlueprint,
      debateLog,
      roundsUsed: debateLog.length
    };
  }

  computeAgreement(artJson, designJson) {
    // Very simplified mock agreement computation
    // In reality, this deeply compares the Spatial JSON trees
    const artCount = artJson.regions.length + (artJson.structures ? artJson.structures.length : 0);
    const designCount = designJson.regions.length + (designJson.structures ? designJson.structures.length : 0);
    const diff = Math.abs(artCount - designCount);
    return Math.max(0, 1.0 - (diff / Math.max(artCount, 1)));
  }

  // ==============================================================================
  // MOCK LLM RESPONSES (For Sandbox Testing)
  // In production, these methods stringify prompts and send them to the LLM API.
  // ==============================================================================

  async mockArtDirectorLLM(request, previousAudit, round) {
    // Simulates an API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    if (round === 1) {
      return {
        changes: ["Added massive open Cathedral Nave", "Added towering Crystal Spire in center (no cover)"],
        blueprint: {
          regions: [ { id: 'nave', openness: 1.0 }, { id: 'spire_top', openness: 1.0 } ],
          structures: [ { id: 'crystal_spire', prefab: 'SYNTHESIZE:tower' } ]
        }
      };
    } else {
      // Art Director compromises slightly based on Designer's feedback
      return {
        changes: ["Kept Nave open but added ruined pews for cover", "Added staircases to Spire"],
        blueprint: {
          regions: [ { id: 'nave', openness: 0.8 }, { id: 'spire_top', openness: 1.0 } ],
          structures: [ { id: 'crystal_spire', prefab: 'SYNTHESIZE:tower' }, { id: 'pews', prefab: 'cover_node' } ]
        }
      };
    }
  }

  async mockLevelDesignerLLM(artVision, round) {
    await new Promise(resolve => setTimeout(resolve, 500));

    if (round === 1) {
      // Designer rejects the open spire (Sniper God-Spot) and the empty nave
      return {
        fixes: ["Nave is too open, added 3-lane cover", "Crystal Spire is a sniper god-spot, deleted it"],
        blueprint: {
          regions: [ { id: 'nave', openness: 0.3 } ], // Spire deleted!
          structures: [ { id: 'crates', prefab: 'barrel_cover' } ]
        }
      };
    } else {
      // Designer accepts the compromised Spire because it now has stairs/cover
      return {
        fixes: ["Adjusted pew placement for better cover rhythm"],
        blueprint: {
          regions: [ { id: 'nave', openness: 0.5 }, { id: 'spire_top', openness: 0.8 } ],
          structures: [ { id: 'crystal_spire', prefab: 'SYNTHESIZE:tower' }, { id: 'pews', prefab: 'barrel_cover' } ]
        }
      };
    }
  }

  async mockCreativeDirectorLLM(request, artVision, designVision) {
    return designVision; // Tie breaker favors playable design
  }
}
