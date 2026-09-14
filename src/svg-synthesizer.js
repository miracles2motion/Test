/**
 * Procedural Blueprint & Dossier SVG Synthesizer
 * 
 * Synthesizes authentic ballpoint drafting blueprints and thumbnail SVGs
 * for any declarative map recipe or layout definition.
 * Adheres to Doodle Strike's Prussian Blue / Drafting Ink aesthetics.
 */

/**
 * Synthesizes an SVG blueprint or thumbnail for a map recipe.
 * @param {Object} recipe Map recipe containing bounds, water, sectors, prefabs, etc.
 * @param {boolean} isDossier If true, outputs 200x100 strategic blueprint; if false, 100x100 thumbnail.
 * @returns {string} Clean SVG markup string.
 */
export function synthesizeMapSVG(recipe, isDossier = false) {
  if (!recipe) {
    return isDossier
      ? `<svg viewBox="0 0 200 100" class="map-svg blueprint" style="opacity:0.85; stroke-linecap:round; stroke-linejoin:round; width:100%; height:100%; max-width:200px;">
          <rect x="20" y="15" width="160" height="70" fill="none" stroke="currentColor" stroke-width="1.5" stroke-dasharray="6 4"/>
          <circle cx="100" cy="50" r="16" fill="none" stroke="currentColor" stroke-width="1.5"/>
          <text x="100" y="53" font-family="monospace" font-size="7" text-anchor="middle" fill="currentColor">NO DATA</text>
        </svg>`
      : `<svg viewBox="0 0 100 100" class="map-svg thumb" style="opacity:0.7; stroke-linecap:round; stroke-linejoin:round; width:100%; height:100%; max-width:90px; max-height:90px;">
          <rect x="20" y="20" width="60" height="60" fill="none" stroke="currentColor" stroke-width="2" stroke-dasharray="4 4"/>
          <circle cx="50" cy="50" r="12" fill="none" stroke="currentColor" stroke-width="2"/>
        </svg>`;
  }

  const c = 'currentColor';
  const alpha = isDossier ? '0.85' : '0.7';
  const half = (recipe.bounds && (recipe.bounds.half || recipe.bounds.arenaHalf)) || 55;
  const mapName = (recipe.name || recipe.id || 'SECTOR').toUpperCase();
  const scaleMeters = Math.round(half * 2);

  // Coordinate projection
  const toSvgX = (wx) => {
    if (isDossier) {
      // 200x100 viewBox: center at 100, spans 160 (from 20 to 180)
      return Math.round(100 + (wx / half) * 75);
    } else {
      // 100x100 viewBox: center at 50, spans 76 (from 12 to 88)
      return Math.round(50 + (wx / half) * 36);
    }
  };

  const toSvgY = (wz) => {
    if (isDossier) {
      // 200x100 viewBox: center at 50, spans 70 (from 15 to 85)
      return Math.round(50 + (wz / half) * 33);
    } else {
      // 100x100 viewBox: center at 50, spans 76 (from 12 to 88)
      return Math.round(50 + (wz / half) * 36);
    }
  };

  const toSvgR = (wr) => {
    const factor = isDossier ? 33 / half : 36 / half;
    return Math.max(1.5, Math.round(wr * factor * 10) / 10);
  };

  let elements = [];

  if (isDossier) {
    // ----------------------------------------------------
    // DOSSIER STRATEGIC BLUEPRINT (200 x 100)
    // ----------------------------------------------------
    
    // 1. Tactical Grid & Outer Bounding Box
    elements.push(`<!-- Drafting Bounds & Corner Ticks -->`);
    elements.push(`<rect x="18" y="12" width="164" height="74" fill="none" stroke="${c}" stroke-width="1.5" stroke-dasharray="4 2"/>`);
    
    // Corner crosshair registration marks (+)
    elements.push(`<path d="M14 12 L22 12 M18 8 L18 16" stroke="${c}" stroke-width="1"/>`);
    elements.push(`<path d="M178 12 L186 12 M182 8 L182 16" stroke="${c}" stroke-width="1"/>`);
    elements.push(`<path d="M14 86 L22 86 M18 82 L18 90" stroke="${c}" stroke-width="1"/>`);
    elements.push(`<path d="M178 86 L186 86 M182 82 L182 90" stroke="${c}" stroke-width="1"/>`);

    // Subtle coordinate grid axes
    elements.push(`<line x1="20" y1="49" x2="180" y2="49" stroke="${c}" stroke-width="0.5" stroke-dasharray="2 4" opacity="0.4"/>`);
    elements.push(`<line x1="100" y1="14" x2="100" y2="84" stroke="${c}" stroke-width="0.5" stroke-dasharray="2 4" opacity="0.4"/>`);

    // 2. Water Ribbon / River / Ocean Feature
    if (recipe.water && recipe.water.ribbon) {
      const rib = recipe.water.ribbon;
      elements.push(`<!-- Water / Canal System -->`);
      if (rib.axis === 'z') {
        const xMin = toSvgX(rib.x - rib.width * 0.5);
        const xMax = toSvgX(rib.x + rib.width * 0.5);
        const yStart = toSvgY(rib.from != null ? rib.from : -half);
        const yEnd = toSvgY(rib.to != null ? rib.to : half);
        const topY = Math.min(yStart, yEnd);
        const botY = Math.max(yStart, yEnd);
        const w = Math.max(4, xMax - xMin);

        elements.push(`<rect x="${xMin}" y="${topY}" width="${w}" height="${botY - topY}" fill="none" stroke="${c}" stroke-width="1.2" stroke-dasharray="2 3"/>`);
        // Subtle wavy water ripple line in the middle
        const midX = (xMin + xMax) / 2;
        elements.push(`<path d="M${midX} ${topY + 4} Q${midX - 2} ${topY + 20} ${midX} ${topY + 36} T${midX} ${botY - 4}" fill="none" stroke="${c}" stroke-width="0.7" stroke-dasharray="1 3" opacity="0.6"/>`);
      } else {
        const zMin = toSvgY(rib.z - rib.width * 0.5);
        const zMax = toSvgY(rib.z + rib.width * 0.5);
        const xStart = toSvgX(rib.from != null ? rib.from : -half);
        const xEnd = toSvgX(rib.to != null ? rib.to : half);
        const leftX = Math.min(xStart, xEnd);
        const rightX = Math.max(xStart, xEnd);
        const h = Math.max(4, zMax - zMin);

        elements.push(`<rect x="${leftX}" y="${zMin}" width="${rightX - leftX}" height="${h}" fill="none" stroke="${c}" stroke-width="1.2" stroke-dasharray="2 3"/>`);
      }

      // Water Crossings
      if (Array.isArray(recipe.water.crossings)) {
        recipe.water.crossings.forEach(cr => {
          if (rib.axis === 'z') {
            const cy = toSvgY(cr.z || 0);
            const cx = toSvgX(rib.x);
            const cw = toSvgR(rib.width * 0.6);
            if (cr.type === 'arched_bridge' || cr.type === 'bridge') {
              elements.push(`<line x1="${cx - cw - 3}" y1="${cy}" x2="${cx + cw + 3}" y2="${cy}" stroke="${c}" stroke-width="2.5"/>`);
              elements.push(`<rect x="${cx - 3}" y="${cy - 2}" width="6" height="4" fill="none" stroke="${c}" stroke-width="1"/>`);
            } else {
              // Stepping stones
              elements.push(`<circle cx="${cx - 4}" cy="${cy}" r="1.5" fill="${c}"/>`);
              elements.push(`<circle cx="${cx}" cy="${cy}" r="1.5" fill="${c}"/>`);
              elements.push(`<circle cx="${cx + 4}" cy="${cy}" r="1.5" fill="${c}"/>`);
            }
          }
        });
      }
    }

    // 3. Central Hub Dais / Clearing
    const clearingR = (recipe.ground && recipe.ground.clearing && recipe.ground.clearing.r) || 8;
    const sClearingR = toSvgR(clearingR);
    elements.push(`<!-- Central Clearing Dais -->`);
    elements.push(`<circle cx="100" cy="49" r="${Math.max(8, sClearingR)}" fill="none" stroke="${c}" stroke-width="1.5"/>`);
    elements.push(`<circle cx="100" cy="49" r="3" fill="${c}"/>`);
    elements.push(`<line x1="100" y1="${49 - sClearingR - 3}" x2="100" y2="${49 - sClearingR + 1}" stroke="${c}" stroke-width="1"/>`);
    elements.push(`<line x1="100" y1="${49 + sClearingR - 1}" x2="100" y2="${49 + sClearingR + 3}" stroke="${c}" stroke-width="1"/>`);

    // 4. Sector Zones & Tactical Boundaries
    if (Array.isArray(recipe.sectors)) {
      elements.push(`<!-- Tactical Sectors -->`);
      recipe.sectors.forEach((sec, idx) => {
        if (sec.bounds) {
          const sx = toSvgX(sec.bounds.minX);
          const ex = toSvgX(sec.bounds.maxX);
          const sy = toSvgY(sec.bounds.minZ);
          const ey = toSvgY(sec.bounds.maxZ);
          const left = Math.min(sx, ex);
          const top = Math.min(sy, ey);
          const w = Math.abs(ex - sx);
          const h = Math.abs(ey - sy);

          elements.push(`<rect x="${left}" y="${top}" width="${w}" height="${h}" fill="none" stroke="${c}" stroke-width="1" stroke-dasharray="3 3" opacity="0.65"/>`);
          const label = sec.id ? sec.id.toUpperCase().replace(/_/g, ' ') : `SEC-0${idx + 1}`;
          elements.push(`<text x="${left + 3}" y="${top + 7}" font-family="monospace" font-size="5" fill="${c}" opacity="0.75">${label.substring(0, 10)}</text>`);
        }
      });
    }

    // 5. Placed Prefabs & Heroic Landmarks
    if (Array.isArray(recipe.prefabs)) {
      elements.push(`<!-- Landmarks & Prefabs -->`);
      recipe.prefabs.forEach(p => {
        const px = toSvgX(p.x);
        const py = toSvgY(p.z);
        const type = (p.type || '').toLowerCase();

        if (type.includes('galleon') || type.includes('ship')) {
          // Ship hull silhouette
          elements.push(`<path d="M${px - 14} ${py - 6} L${px + 10} ${py - 6} L${px + 14} ${py} L${px + 10} ${py + 6} L${px - 14} ${py + 6} Z" fill="none" stroke="${c}" stroke-width="1.8"/>`);
          // 3 Masts
          elements.push(`<circle cx="${px - 6}" cy="${py}" r="1.5" fill="${c}"/>`);
          elements.push(`<circle cx="${px}" cy="${py}" r="2" fill="${c}"/>`);
          elements.push(`<circle cx="${px + 6}" cy="${py}" r="1.5" fill="${c}"/>`);
          elements.push(`<line x1="${px}" y1="${py - 4}" x2="${px}" y2="${py + 4}" stroke="${c}" stroke-width="1.2"/>`);
        } else if (type.includes('crane')) {
          // Crane arm
          elements.push(`<line x1="${px}" y1="${py}" x2="${px + 6}" y2="${py - 4}" stroke="${c}" stroke-width="1.5"/>`);
          elements.push(`<circle cx="${px}" cy="${py}" r="2" fill="${c}"/>`);
          elements.push(`<circle cx="${px + 6}" cy="${py - 4}" r="1" fill="none" stroke="${c}" stroke-width="1"/>`);
        } else if (type.includes('warehouse') || type.includes('building') || type.includes('shack')) {
          elements.push(`<rect x="${px - 5}" y="${py - 4}" width="10" height="8" fill="none" stroke="${c}" stroke-width="1.4"/>`);
          elements.push(`<line x1="${px - 5}" y1="${py - 4}" x2="${px + 5}" y2="${py + 4}" stroke="${c}" stroke-width="0.6" stroke-dasharray="1 2"/>`);
        } else if (type.includes('tree') || type.includes('palm')) {
          // Palm or pine marker
          elements.push(`<circle cx="${px}" cy="${py}" r="2" fill="none" stroke="${c}" stroke-width="1"/>`);
          elements.push(`<circle cx="${px}" cy="${py}" r="0.8" fill="${c}"/>`);
        } else {
          // Generic tactical structure
          elements.push(`<rect x="${px - 3}" y="${py - 3}" width="6" height="6" fill="none" stroke="${c}" stroke-width="1.2"/>`);
        }
      });
    }

    // 6. Placed Pickups & Balance Markers
    if (Array.isArray(recipe.pickups)) {
      recipe.pickups.forEach(pk => {
        const kx = toSvgX(pk.x);
        const ky = toSvgY(pk.z);
        if (pk.type === 'health') {
          elements.push(`<path d="M${kx - 2} ${ky} L${kx + 2} ${ky} M${kx} ${ky - 2} L${kx} ${ky + 2}" stroke="${c}" stroke-width="1.2"/>`);
        } else {
          // Ammo / speed diamond
          elements.push(`<path d="M${kx} ${ky - 2} L${kx + 2} ${ky} L${kx} ${ky + 2} L${kx - 2} ${ky} Z" fill="none" stroke="${c}" stroke-width="1"/>`);
        }
      });
    }

    // 7. Tactical Header & Scale Rule
    elements.push(`<!-- Tactical Legend & Scale -->`);
    elements.push(`<text x="24" y="21" font-family="monospace" font-size="6" font-weight="bold" fill="${c}" letter-spacing="1">DRAFT [${recipe.id || 'DS'}]</text>`);
    elements.push(`<text x="100" y="93" font-family="monospace" font-size="6" text-anchor="middle" fill="${c}" letter-spacing="1.2">${scaleMeters}m STRATEGIC BLUEPRINT - ${mapName}</text>`);

    return `<svg viewBox="0 0 200 100" class="map-svg blueprint" style="opacity:${alpha}; stroke-linecap:round; stroke-linejoin:round; width:100%; height:100%; max-width:200px;">
  ${elements.join('\n  ')}
</svg>`;

  } else {
    // ----------------------------------------------------
    // THUMBNAIL ICON (100 x 100)
    // ----------------------------------------------------
    elements.push(`<!-- Outer Hex / Shield Frame -->`);
    elements.push(`<path d="M22 75 L22 45 L50 28 L78 45 L78 75 L50 88 Z" fill="none" stroke="${c}" stroke-width="2"/>`);
    elements.push(`<line x1="22" y1="45" x2="50" y2="58" stroke="${c}" stroke-width="1.5"/>`);
    elements.push(`<line x1="78" y1="45" x2="50" y2="58" stroke="${c}" stroke-width="1.5"/>`);
    elements.push(`<line x1="50" y1="58" x2="50" y2="88" stroke="${c}" stroke-width="1.5"/>`);

    // Nautical / Thematic Emblem inside upper diamond
    const theme = (recipe.palette || recipe.id || '').toLowerCase();
    if (theme.includes('tropical') || theme.includes('pirate') || theme.includes('sea')) {
      // Skull / Ship Wheel Anchor Silhouette
      elements.push(`<!-- Jolly Anchor / Wheel Icon -->`);
      elements.push(`<circle cx="50" cy="40" r="7" fill="none" stroke="${c}" stroke-width="1.8"/>`);
      elements.push(`<circle cx="50" cy="40" r="2.5" fill="${c}"/>`);
      elements.push(`<line x1="50" y1="31" x2="50" y2="49" stroke="${c}" stroke-width="1.2"/>`);
      elements.push(`<line x1="41" y1="40" x2="59" y2="40" stroke="${c}" stroke-width="1.2"/>`);
      // Lower crossbones
      elements.push(`<line x1="36" y1="64" x2="44" y2="72" stroke="${c}" stroke-width="1.5"/>`);
      elements.push(`<line x1="64" y1="64" x2="56" y2="72" stroke="${c}" stroke-width="1.5"/>`);
    } else if (theme.includes('forest') || theme.includes('wood')) {
      // Pine tree silhouette
      elements.push(`<path d="M50 24 L40 40 L45 40 L38 52 L62 52 L55 40 L60 40 Z" fill="none" stroke="${c}" stroke-width="1.8"/>`);
      elements.push(`<line x1="50" y1="52" x2="50" y2="58" stroke="${c}" stroke-width="2"/>`);
    } else if (theme.includes('clockwork') || theme.includes('gear')) {
      // Cog / Gear
      elements.push(`<circle cx="50" cy="42" r="8" fill="none" stroke="${c}" stroke-width="2"/>`);
      elements.push(`<circle cx="50" cy="42" r="3" fill="${c}"/>`);
      elements.push(`<path d="M50 31 L50 34 M50 50 L50 53 M39 42 L42 42 M58 42 L61 42" stroke="${c}" stroke-width="2"/>`);
    } else {
      // Central tactical crosshair & core
      elements.push(`<circle cx="50" cy="42" r="6" fill="none" stroke="${c}" stroke-width="1.8"/>`);
      elements.push(`<circle cx="50" cy="42" r="2" fill="${c}"/>`);
      elements.push(`<line x1="38" y1="42" x2="62" y2="42" stroke="${c}" stroke-width="1" stroke-dasharray="2 2"/>`);
      elements.push(`<line x1="50" y1="30" x2="50" y2="54" stroke="${c}" stroke-width="1" stroke-dasharray="2 2"/>`);
    }

    return `<svg viewBox="0 0 100 100" class="map-svg thumb" style="opacity:${alpha}; stroke-linecap:round; stroke-linejoin:round; width:100%; height:100%; max-width:90px; max-height:90px;">
  ${elements.join('\n  ')}
</svg>`;
  }
}
