#!/usr/bin/env node
/**
 * Dream Master NLP Router
 * Understands natural language and routes to the correct Doodle Strike workflow.
 */

import { GoogleGenAI, Type } from '@google/genai';
import { execSync } from 'child_process';
import dotenv from 'dotenv';
import process from 'process';

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error('❌ Missing GEMINI_API_KEY in .env file. Please add it to use the NLP Router.');
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey });

const prompt = process.argv.slice(2).join(' ');
if (!prompt) {
  console.log(`
🌌 Dream NLP Router
============================================================
Talk to Dream in natural language.
Usage:
  npm run dream "build me a cyber map called neon district"
  npm run dream "heal my pirate cove map"
  npm run dream "inject macro structures into zen"
============================================================
`);
  process.exit(0);
}

console.log(`\n🧠 Dream is thinking about: "${prompt}"...\n`);

const schema = {
  type: Type.OBJECT,
  properties: {
    action: {
      type: Type.STRING,
      description: "The core action to perform.",
      enum: ["god_mode", "refine", "macro", "inject"]
    },
    mapName: {
      type: Type.STRING,
      description: "The machine-safe key for the map (lowercase, underscores instead of spaces, e.g., 'neon_district', 'zen', 'pirate_cove')."
    },
    theme: {
      type: Type.STRING,
      description: "The architectural theme.",
      enum: ["urban", "cyber", "steampunk", "colossal", "maritime", "zen", "anomalous"]
    },
    refineOption: {
      type: Type.STRING,
      description: "Only required if action is 'refine'. Whether to upgrade existing generic props or heal structures with micro-details.",
      enum: ["upgrade", "heal"]
    }
  },
  required: ["action", "mapName", "theme"]
};

async function route() {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are the routing brain for 'Dream', an AI architect for a 3D tactical shooter. 
Map the user's natural language request to the required fields. 
If the user wants a new map or the ultimate pipeline, choose 'god_mode'. 
If they want to 'heal' or 'improve' an existing full map, choose 'refine' and set 'refineOption'. 
If they just want to 'inject' or add 'macro' buildings, choose those respective actions.
If they don't specify a theme, infer the most logical one based on the map name (e.g. 'pirate' -> maritime, 'shrine' -> zen, 'city' -> urban, 'factory' -> steampunk).
      
User request: "${prompt}"`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: schema
      }
    });

    const data = JSON.parse(response.text());
    
    let command = '';
    
    if (data.action === 'god_mode') {
      command = `npm run dream:god ${data.mapName} ${data.theme}`;
    } else if (data.action === 'refine') {
      const option = data.refineOption || 'heal';
      command = `node src/map-refiner.js ${data.mapName} ${data.theme} ${option}`;
    } else if (data.action === 'macro') {
      command = `npm run dream:macro ${data.mapName} ${data.theme}`;
    } else if (data.action === 'inject') {
      command = `npm run dream:inject ${data.mapName} ${data.theme}`;
    }

    console.log(`✨ Dream understood your intent! Routing to:`);
    console.log(`   > ${command}\n`);

    execSync(command, { stdio: 'inherit' });

  } catch (err) {
    console.error(`\n❌ Dream failed to process your request: ${err.message}`);
    process.exit(1);
  }
}

route();
