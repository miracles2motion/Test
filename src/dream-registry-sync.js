import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const REGISTRY_PATH = path.join(__dirname, 'dream-features.json');

// Auto-discovery logic
export function syncRegistry() {
  console.log('🔄 Scanning workspace for new Dream capabilities...');
  
  let registry = {};
  if (fs.existsSync(REGISTRY_PATH)) {
    registry = JSON.parse(fs.readFileSync(REGISTRY_PATH, 'utf8'));
  } else {
    registry = { orchestration: [], diagnostics: [], remediation: [], learning: [] };
  }

  // Scan src/ for map-* or dream-* scripts to auto-discover capabilities
  const srcFiles = fs.readdirSync(__dirname);
  let newFeaturesCount = 0;

  for (const file of srcFiles) {
    if (!file.endsWith('.js')) continue;
    
    const isDreamScript = file.startsWith('dream-') || file.startsWith('map-');
    if (!isDreamScript) continue;

    const capabilityName = file.replace('dream-', '').replace('map-', '').replace('.js', '');
    
    // Check if it already exists in the registry
    let exists = false;
    for (const category of Object.values(registry)) {
      if (category.find(f => f.name === capabilityName || f.name.replace('_', '-') === capabilityName)) {
        exists = true;
        break;
      }
    }

    if (!exists) {
      // Auto-categorize based on keywords
      let category = 'orchestration';
      if (['inspect', 'simulate', 'audit'].some(kw => capabilityName.includes(kw))) category = 'diagnostics';
      else if (['heal', 'detail', 'refiner', 'injector', 'deleter'].some(kw => capabilityName.includes(kw))) category = 'remediation';
      else if (['learn', 'pack', 'memory'].some(kw => capabilityName.includes(kw))) category = 'learning';

      if (!registry[category]) registry[category] = [];
      
      registry[category].push({
        name: capabilityName,
        description: `Auto-discovered capability: ${capabilityName}`
      });
      newFeaturesCount++;
      console.log(`✨ Auto-discovered new feature: [${category}] ${capabilityName}`);
    }
  }

  if (newFeaturesCount > 0) {
    fs.writeFileSync(REGISTRY_PATH, JSON.stringify(registry, null, 2), 'utf8');
    console.log(`✅ Registry synced. Added ${newFeaturesCount} new capabilities.`);
  } else {
    console.log(`ℹ️ Registry is already up to date.`);
  }
}

// If run directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  syncRegistry();
}
