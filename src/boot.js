import { deviceProbe } from './perf/device-probe.js';

// The Boot Sequence (File 10 / File 01)
async function boot() {
  console.log('[Boot] Initializing Dream Phase 7 Engine...');
  
  // Show a minimal loading state if needed here
  const canvas = document.getElementById('c');
  const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
  
  // 1. Run the Device Probe (Layer 1-3)
  console.log('[Boot] Running device probe...');
  const profile = await deviceProbe.runProbe(gl);
  
  // 2. We can export or store the profile globally so main.js can read it synchronously
  window.__DEVICE_PROFILE = profile;
  
  // Configure enemy pool concurrency budget to match device tier
  const { enemyPoolManager } = await import('./perf/enemy-pool.js');
  enemyPoolManager.setBudget(profile.enemyBudget);
  
  // 3. Dynamically import the rest of the game now that we know our tier
  console.log('[Boot] Device Profile locked. Handing off to main...');
  await import('./main.js');
}

boot().catch(err => {
  console.error('[Boot] Fatal initialization error:', err);
  alert('Fatal error during initialization. Please reload.');
});
