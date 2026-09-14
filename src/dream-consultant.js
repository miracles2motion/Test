#!/usr/bin/env node
/**
Dream Consultant & Active Teaching Engine (Dream Teach / Dream Learn)
Allows Dream to open structured inquiry tickets when confused or lacking concept/geometry clarity,
output questions to the user/chat, ingest human teaching, permanently store learned lessons in
.agents/learning-cache.json, execute pending operations, and clean up temporary lesson files.
*/

import fs from 'fs';
import path from 'path';

const LESSONS_DIR = path.resolve('.agents/lessons');
const CACHE_FILE = path.resolve('.agents/learning-cache.json');

// Ensure directories exist
if (!fs.existsSync(LESSONS_DIR)) {
  fs.mkdirSync(LESSONS_DIR, { recursive: true });
}

/**
Opens a new consultation/inquiry ticket when Dream is confused or needs creative/tactical guidance.
*/
export function openConsultationTicket({
  topic = 'general',
  mapName = null,
  context = '',
  dilemma = '',
  questions = [],
  options = [],
  actionPayload = {}
}) {
  const ticketId = `ticket_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const ticketFile = path.join(LESSONS_DIR, `pending_${ticketId}.json`);

  const ticketData = {
    ticketId,
    timestamp: new Date().toISOString(),
    status: 'PENDING_HUMAN_TEACHING',
    topic,
    mapName,
    context,
    dilemma,
    questions,
    options,
    actionPayload,
    humanResolution: null
  };

  fs.writeFileSync(ticketFile, JSON.stringify(ticketData, null, 2), 'utf8');

  console.log(`
================================================================================
🤔 DREAM NEEDS GUIDANCE: CONSULTATION TICKET [${ticketId}]
================================================================================
📍 Topic: ${topic.toUpperCase()} ${mapName ? `(Map: ${mapName})` : ''}
⚠️ Dilemma: ${dilemma}
--------------------------------------------------------------------------------
💡 Context:
${context}
--------------------------------------------------------------------------------
❓ Questions for Human Architect:`);

  questions.forEach((q, idx) => {
    console.log(`   ${idx + 1}. ${q}`);
  });

  if (options && options.length > 0) {
    console.log('\n🎯 Suggested Approaches:');
    options.forEach((opt, idx) => {
      console.log(`   [Option ${idx + 1}] ${opt}`);
    });
  }

  console.log(`
--------------------------------------------------------------------------------
📁 Temporary Ticket Created: .agents/lessons/pending_${ticketId}.json

👉 To teach Dream:
   1. Provide the guidance or edit the file with your answers.
   2. Run: npm run dream:teach resume ${ticketId} (or node dream.js "resume ${ticketId}")
   *Note: Dream will absorb this lesson into permanent memory and automatically delete the temp file.
================================================================================
`);

  return ticketId;
}

/**
Lists all active pending consultation tickets.
*/
export function listPendingTickets() {
  if (!fs.existsSync(LESSONS_DIR)) return [];
  const files = fs.readdirSync(LESSONS_DIR).filter(f => f.startsWith('pending_') && f.endsWith('.json'));
  return files.map(file => {
    const fullPath = path.join(LESSONS_DIR, file);
    return JSON.parse(fs.readFileSync(fullPath, 'utf8'));
  });
}

/**
Ingests human teaching for a ticket, commits it permanently to learning-cache.json,
executes any pending action, and cleans up the temporary file.
*/
export function resolveConsultationTicket(ticketIdOrName, resolutionData = null) {
  let targetFile = null;
  
  const files = fs.readdirSync(LESSONS_DIR).filter(f => f.endsWith('.json'));
  
  // Match by ticket ID or partial name
  for (const file of files) {
    if (file.includes(ticketIdOrName)) {
      targetFile = path.join(LESSONS_DIR, file);
      break;
    }
  }
  
  if (!targetFile && files.length === 1 && (!ticketIdOrName || ticketIdOrName === 'latest' || ticketIdOrName === 'resume')) {
    targetFile = path.join(LESSONS_DIR, files[0]);
  }

  if (!targetFile || !fs.existsSync(targetFile)) {
    console.log(`❌ No pending consultation ticket found matching: "${ticketIdOrName}"`);
    return false;
  }

  const ticket = JSON.parse(fs.readFileSync(targetFile, 'utf8'));

  // If external resolution was provided directly via function call
  if (resolutionData) {
    ticket.humanResolution = resolutionData;
  }

  if (!ticket.humanResolution) {
    console.log(`⚠️ Ticket [${ticket.ticketId}] is still pending answers! Please provide answers in .agents/lessons/pending_${ticket.ticketId}.json under "humanResolution" or specify: npm run dream:teach resolve ${ticket.ticketId} "Your instructions/answers"`);
    return false;
  }

  console.log(`
🎓 [DREAM ABSORPTION ENGINE] Ingesting lesson from Ticket [${ticket.ticketId}]...
--------------------------------------------------------------------------------
📖 Learned Knowledge:
   • Topic: ${ticket.topic}
   • Dilemma: ${ticket.dilemma}
   • Solution: ${typeof ticket.humanResolution === 'string' ? ticket.humanResolution : JSON.stringify(ticket.humanResolution)}
`);

  // Record into permanent learning memory
  let cache = { rules: [], stats: { autoRepairsCount: 0 }, humanLessons: [] };
  if (fs.existsSync(CACHE_FILE)) {
    try {
      cache = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8'));
      if (!cache.humanLessons) cache.humanLessons = [];
    } catch {
      cache = { rules: [], stats: { autoRepairsCount: 0 }, humanLessons: [] };
    }
  }

  const lessonEntry = {
    id: `lesson_${Date.now()}`,
    topic: ticket.topic,
    mapName: ticket.mapName,
    dilemma: ticket.dilemma,
    resolution: ticket.humanResolution,
    absorbedAt: new Date().toISOString()
  };

  cache.humanLessons.push(lessonEntry);
  fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2) + '\n', 'utf8');

  console.log('✅ Lesson permanently written to .agents/learning-cache.json (humanLessons)');

  // If the lesson is about an unknown concept/theme, also write it into thematic-memory.json
  const THEMATIC_MEMORY_FILE = path.resolve('.agents/thematic-memory.json');
  if (ticket.topic.includes('thematic') && fs.existsSync(THEMATIC_MEMORY_FILE)) {
    try {
      const memory = JSON.parse(fs.readFileSync(THEMATIC_MEMORY_FILE, 'utf8'));
      if (!memory.thematicArchetypes) memory.thematicArchetypes = {};
      
      const themeKey = (ticket.mapName || 'custom').toLowerCase().replace(/[^a-z0-9_]/g, '_');
      let archData = null;

      if (typeof ticket.humanResolution === 'object' && ticket.humanResolution !== null) {
        archData = {
          keywords: ticket.humanResolution.keywords || [themeKey],
          primaryInk: ticket.humanResolution.primaryInk || 'INK.BLUE',
          secondaryInk: ticket.humanResolution.secondaryInk || 'INK.BLACK',
          accentInk: ticket.humanResolution.accentInk || 'INK.ORANGE',
          hazardInk: ticket.humanResolution.hazardInk || 'INK.RED',
          props: ticket.humanResolution.props || {
            tier1_micro: ["cover prop", "barrier block"],
            tier2_meso: ["tactical platform", "walkway ramp"],
            tier3_macro: ["central landmark spire", "watchtower"],
            tier4_kinetic: ["swaying boughs", "gliding paper elements"]
          }
        };
      } else if (typeof ticket.humanResolution === 'string') {
        const text = ticket.humanResolution.toLowerCase();
        const priInk = text.includes('green') ? 'INK.GREEN' : (text.includes('red') ? 'INK.RED' : (text.includes('orange') ? 'INK.ORANGE' : 'INK.BLUE'));
        const accInk = text.includes('orange') && priInk !== 'INK.ORANGE' ? 'INK.ORANGE' : (text.includes('red') && priInk !== 'INK.RED' ? 'INK.RED' : 'INK.BLUE');
        
        // Extract comma-separated phrases or bullet items as props
        const items = text.split(/[,;\n•]+/).map(s => s.trim()).filter(s => s.length > 3 && !s.includes('color') && !s.includes('ink'));
        
        archData = {
          keywords: [themeKey, ...items.slice(0, 5).map(w => w.split(' ')[0])],
          primaryInk: priInk,
          secondaryInk: 'INK.BLACK',
          accentInk: accInk,
          hazardInk: 'INK.RED',
          props: {
            tier1_micro: items.slice(0, 3).length > 0 ? items.slice(0, 3) : ["tactical micro cover", "waist-high block"],
            tier2_meso: items.slice(3, 6).length > 0 ? items.slice(3, 6) : ["elevated platform", "connecting bridge walkway"],
            tier3_macro: items.slice(6, 9).length > 0 ? items.slice(6, 9) : ["central landmark centerpiece", "overlook tower"],
            tier4_kinetic: items.slice(9, 11).length > 0 ? items.slice(9, 11) : ["gliding paper planes", "kinetic swaying elements"]
          }
        };
      }

      if (archData) {
        memory.thematicArchetypes[themeKey] = archData;
      }
      fs.writeFileSync(THEMATIC_MEMORY_FILE, JSON.stringify(memory, null, 2) + '\n', 'utf8');
      console.log(`✅ Thematic archetype "${themeKey}" registered into .agents/thematic-memory.json`);
    } catch (e) {
      console.warn(`Could not update thematic-memory.json: ${e.message}`);
    }
  }
  
  // Auto-cleanup: remove temporary pending file
  fs.unlinkSync(targetFile);
  console.log(`🗑️ Temporary lesson file removed: ${path.basename(targetFile)} (Disk footprint cleaned).`);
  
  console.log(`
================================================================================
🎉 TEACHING COMPLETE: Dream has grown smarter and will apply this solution automatically in the future!
================================================================================
`);

  return true;
}

// CLI handler
if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve('src/dream-consultant.js')) {
  const command = process.argv[2] || 'list';
  const target = process.argv[3];
  const resolutionArg = process.argv.slice(4).join(' ');

  if (command === 'list' || command === 'pending') {
    const pending = listPendingTickets();
    console.log(`\n📋 PENDING DREAM CONSULTATION TICKETS (${pending.length}):`);
    if (pending.length === 0) {
      console.log('   ✓ None! Dream is currently confident and operating smoothly.\n');
    } else {
      pending.forEach(t => {
        console.log(`   • [${t.ticketId}] (${t.topic}) - ${t.dilemma}`);
        console.log(`     File: .agents/lessons/pending_${t.ticketId}.json\n`);
      });
    }
  } else if (command === 'resume' || command === 'resolve') {
    resolveConsultationTicket(target, resolutionArg || null);
  } else if (command === 'ask' || command === 'test') {
    openConsultationTicket({
      topic: 'thematic_architecture',
      mapName: target || 'test_sector',
      context: 'Dream is trying to synthesize a high-tier landmark for the Central Atrium, but the theme has conflicting styles.',
      dilemma: 'Unsure whether the Central Hub should feature an ancient Clockwork Astrolabe or a sunken Pirate Galleon.',
      questions: [
        'Which centerpiece best fits the primary gameplay sightlines?',
        'What vertical height should the sniper perch cap at (Y=6 or Y=9)?'
      ],
      options: [
        'Build a kinetic 4-pillar Clockwork Astrolabe with rotating gear rings at Y=7.5',
        'Place a tilted Pirate Ship Galleon hull with climbable rigging and grapple crows nest at Y=9.0'
      ]
    });
  }
}
