/**
 * Doodle Strike - Negative Space Profiler
 * 
 * Analyzes volumetric voids to determine their architectural purpose
 * (e.g. Atrium, Corridor, Shaft) rather than treating them as just empty boxes.
 */

export class NegativeSpaceProfiler {
  
  /**
   * Profile a void candidate object {x, y, z, width, height, depth}
   */
  profileVoid(voidCandidate) {
    const volume = voidCandidate.width * voidCandidate.height * voidCandidate.depth;
    
    // Sort dimensions to find dominant axes
    const dims = [
      { axis: 'x', size: voidCandidate.width },
      { axis: 'y', size: voidCandidate.height },
      { axis: 'z', size: voidCandidate.depth }
    ].sort((a, b) => b.size - a.size);
    
    const dominantAxis = dims[0].axis;
    
    // Aspect ratio: longest / shortest
    const aspectRatio = dims[0].size / dims[2].size;
    
    const profile = {
      volume,
      aspectRatio,
      dominantAxis,
      width: voidCandidate.width,
      height: voidCandidate.height,
      depth: voidCandidate.depth,
      archetype: null
    };

    profile.archetype = this.classify(profile);
    return profile;
  }

  /**
   * Classifies the void into a spatial archetype based on its profile
   */
  classify(profile) {
    // ATRIUM: massive volume, roughly cubic or slightly tall
    if (profile.volume > 800 && profile.aspectRatio < 2.0 && profile.height > 5.0) {
      return 'ATRIUM';
    }
    
    // SHAFT: tall vertical space
    if (profile.dominantAxis === 'y' && profile.aspectRatio > 2.0 && profile.height > 6.0) {
      return 'SHAFT';
    }
    
    // CORRIDOR: long horizontal space
    if ((profile.dominantAxis === 'x' || profile.dominantAxis === 'z') && profile.aspectRatio > 2.5) {
      return 'CORRIDOR';
    }
    
    // ARENA: huge horizontal space
    if (profile.volume > 1500) {
      return 'ARENA';
    }
    
    // ALCOVE: small pocket
    if (profile.volume < 150) {
      return 'ALCOVE';
    }
    
    // Default fallback
    return 'ROOM';
  }

  /**
   * Returns a list of prefab categories or specific prefab IDs that fit this archetype.
   */
  recommendPrefabs(archetype, templates) {
    // Filter templates based on archetype characteristics
    const recommended = templates.filter(t => {
      // Very basic heuristic mapping for the existing templates
      if (archetype === 'SHAFT') {
        return t.id.includes('tower') || t.id.includes('beacon') || t.id.includes('turret') || t.id.includes('furnace');
      }
      if (archetype === 'ATRIUM' || archetype === 'ARENA') {
        return t.id.includes('dynamo') || t.id.includes('rampart') || t.id.includes('vault') || t.id.includes('pavilion');
      }
      if (archetype === 'CORRIDOR') {
        return t.id.includes('bridge') || t.id.includes('gantry') || t.id.includes('junction');
      }
      if (archetype === 'ALCOVE') {
        return t.id.includes('teahouse') || t.id.includes('overlook') || t.id.includes('kiosk');
      }
      // If it's a generic ROOM or we have no strict match, allow any
      return true;
    });
    
    // If our strict filter removed everything, fallback to all templates
    return recommended.length > 0 ? recommended : templates;
  }
}
