// src/memory-store.js

export const AEI_PERSISTENCE_KEY = 'AEI_GOD_PERSISTENCE';

export const TelemetryCompressor = {
  pack(profile) {
    try {
      return JSON.stringify(profile);
    } catch (e) {
      console.warn('[AEI] Compression Error:', e);
      return null;
    }
  },
  unpack(data) {
    try {
      if (!data) return null;
      return JSON.parse(data);
    } catch (e) {
      console.warn('[AEI] Decompression Error:', e);
      return null;
    }
  }
};

export function commitBrainState(profile) {
  if (typeof window === 'undefined') return;
  const serialized = TelemetryCompressor.pack(profile);
  if (serialized) {
    localStorage.setItem(AEI_PERSISTENCE_KEY, serialized);
    console.warn('[AEI] MEMORY PRESERVED: Swarm will remember this encounter.');
  }
}

export function loadBrainState() {
  if (typeof window === 'undefined') return null;
  
  const data = localStorage.getItem(AEI_PERSISTENCE_KEY);
  if (data) {
    return TelemetryCompressor.unpack(data);
  }
  
  // Try to load legacy format if AEI is new
  const legacyData = localStorage.getItem('doodle_brain');
  if (legacyData) {
     return TelemetryCompressor.unpack(legacyData);
  }
  
  return null;
}
