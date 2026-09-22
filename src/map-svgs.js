// src/map-svgs.js
// Extracted SVG thumbnail and dossier blueprints for every map.
// Imported by main.js to keep the monolith smaller and more analysable.
import { synthesizeMapSVG } from './svg-synthesizer.js';
import { LEVELS } from './level.js';

export function getMapSVG(key, isDossier = false) {
  const c = 'currentColor';
  const alpha = isDossier ? '0.85' : '0.7';
  let paths = '';

  if (key === 'district') {
    if (isDossier) {
      return `<svg viewBox="0 0 200 100" class="map-svg blueprint" style="opacity:${alpha}; stroke-linecap:round; stroke-linejoin:round; width:100%; height:100%; max-width: ${isDossier ? '200px' : '90px'};">
        <rect x="5" y="5" width="45" height="40" fill="none" stroke="${c}" stroke-width="1.5" />
        <rect x="60" y="5" width="80" height="40" fill="none" stroke="${c}" stroke-width="1.5" />
        <rect x="150" y="5" width="45" height="40" fill="none" stroke="${c}" stroke-width="1.5" />
        
        <rect x="5" y="55" width="60" height="40" fill="none" stroke="${c}" stroke-width="1.5" />
        <rect x="75" y="55" width="65" height="40" fill="none" stroke="${c}" stroke-width="1.5" />
        <rect x="150" y="55" width="45" height="40" fill="none" stroke="${c}" stroke-width="1.5" />
        
        <line x1="0" y1="50" x2="200" y2="50" stroke="${c}" stroke-dasharray="4 4" stroke-width="1"/>
        <line x1="55" y1="0" x2="55" y2="50" stroke="${c}" stroke-dasharray="4 4" stroke-width="1"/>
        <line x1="70" y1="50" x2="70" y2="100" stroke="${c}" stroke-dasharray="4 4" stroke-width="1"/>
        <line x1="145" y1="0" x2="145" y2="100" stroke="${c}" stroke-dasharray="4 4" stroke-width="1"/>
        
        <circle cx="30" cy="25" r="8" fill="none" stroke="${c}" stroke-width="1"/>
        <text x="30" y="28" font-family="monospace" font-size="8" text-anchor="middle" fill="${c}">A1</text>
        
        <circle cx="110" cy="75" r="8" fill="none" stroke="${c}" stroke-width="1"/>
        <text x="110" y="78" font-family="monospace" font-size="8" text-anchor="middle" fill="${c}">B2</text>
        
        <line x1="60" y1="10" x2="140" y2="10" stroke="${c}" stroke-width="0.5"/>
        <line x1="60" y1="8" x2="60" y2="12" stroke="${c}" stroke-width="0.5"/>
        <line x1="140" y1="8" x2="140" y2="12" stroke="${c}" stroke-width="0.5"/>
        <text x="100" y="8" font-family="monospace" font-size="6" text-anchor="middle" fill="${c}">120m</text>

        <rect x="175" y="75" width="10" height="10" fill="none" stroke="${c}" stroke-width="1"/>
        <rect x="178" y="78" width="4" height="4" fill="${c}"/>
      </svg>`;
    } else {
      return `<svg viewBox="0 0 100 100" class="map-svg thumb" style="opacity:${alpha}; stroke-linecap:round; stroke-linejoin:round; width:100%; height:100%; max-width: 90px; max-height: 90px;">
        <path d="M20 75 L20 45 L50 30 L80 45 L80 75 L50 90 Z" fill="none" stroke="${c}" stroke-width="2"/>
        <path d="M20 45 L50 60 L80 45" fill="none" stroke="${c}" stroke-width="2"/>
        <path d="M50 60 L50 90" fill="none" stroke="${c}" stroke-width="2"/>
        
        <path d="M30 55 L40 60 M30 65 L40 70 M60 60 L70 55 M60 70 L70 65" stroke="${c}" stroke-width="1.5"/>
        <path d="M35 37 L50 30 L65 37" fill="none" stroke="${c}" stroke-width="1"/>
        
        <path d="M10 50 L10 20 L30 10 L50 20" fill="none" stroke="${c}" stroke-width="1.5" stroke-dasharray="2 2"/>
        <path d="M10 20 L20 25 L30 20 L30 10" fill="none" stroke="${c}" stroke-width="1" stroke-dasharray="2 2"/>
        <path d="M20 25 L20 45" fill="none" stroke="${c}" stroke-width="1" stroke-dasharray="2 2"/>
        
        <path d="M90 50 L90 30 L70 20 L50 30" fill="none" stroke="${c}" stroke-width="1.5" stroke-dasharray="2 2"/>
        <path d="M90 30 L80 35 L70 30 L70 20" fill="none" stroke="${c}" stroke-width="1" stroke-dasharray="2 2"/>
        <path d="M80 35 L80 45" fill="none" stroke="${c}" stroke-width="1" stroke-dasharray="2 2"/>
      </svg>`;
    }
  } else if (key === 'classroom') {
    if (isDossier) {
      return `<svg viewBox="0 0 200 100" class="map-svg blueprint" style="opacity:${alpha}; stroke-linecap:round; stroke-linejoin:round; width:100%; height:100%; max-width: ${isDossier ? '200px' : '90px'};">
        <rect x="20" y="20" width="160" height="60" fill="none" stroke="${c}" stroke-width="2"/>
        <line x1="20" y1="20" x2="40" y2="40" stroke="${c}" stroke-width="1"/>
        <line x1="180" y1="20" x2="160" y2="40" stroke="${c}" stroke-width="1"/>
        <line x1="20" y1="80" x2="40" y2="60" stroke="${c}" stroke-width="1"/>
        <line x1="180" y1="80" x2="160" y2="60" stroke="${c}" stroke-width="1"/>
        <rect x="40" y="40" width="120" height="20" fill="none" stroke="${c}" stroke-width="1" stroke-dasharray="2 2"/>
        
        <path d="M60 70 L90 70 L85 50 L55 50 Z" fill="none" stroke="${c}" stroke-width="1.5"/>
        <path d="M60 70 L75 85 L90 70" fill="none" stroke="${c}" stroke-width="1.5"/>
        <path d="M75 85 L85 50" fill="none" stroke="${c}" stroke-width="1.5"/>
        
        <circle cx="140" cy="50" r="12" fill="none" stroke="${c}" stroke-width="1.5"/>
        <circle cx="140" cy="50" r="4" fill="none" stroke="${c}" stroke-width="1.5"/>
        <line x1="140" y1="38" x2="140" y2="30" stroke="${c}" stroke-width="1"/>
        <line x1="140" y1="62" x2="140" y2="70" stroke="${c}" stroke-width="1"/>
        
        <rect x="30" y="25" width="40" height="10" transform="rotate(-15 30 25)" fill="none" stroke="${c}" stroke-width="1"/>
        <line x1="35" y1="25" x2="35" y2="35" transform="rotate(-15 30 25)" stroke="${c}" stroke-width="0.5"/>
        <line x1="40" y1="25" x2="40" y2="35" transform="rotate(-15 30 25)" stroke="${c}" stroke-width="0.5"/>
        <line x1="45" y1="25" x2="45" y2="35" transform="rotate(-15 30 25)" stroke="${c}" stroke-width="0.5"/>
      </svg>`;
    } else {
      return `<svg viewBox="0 0 100 100" class="map-svg thumb" style="opacity:${alpha}; stroke-linecap:round; stroke-linejoin:round; width:100%; height:100%; max-width: 90px; max-height: 90px;">
        <rect x="10" y="20" width="80" height="60" rx="4" fill="none" stroke="${c}" stroke-width="2"/>
        <line x1="10" y1="30" x2="90" y2="30" stroke="${c}" stroke-width="1" stroke-dasharray="2 2"/>
        <line x1="10" y1="40" x2="90" y2="40" stroke="${c}" stroke-width="1" stroke-dasharray="2 2"/>
        <line x1="10" y1="50" x2="90" y2="50" stroke="${c}" stroke-width="1" stroke-dasharray="2 2"/>
        <line x1="10" y1="60" x2="90" y2="60" stroke="${c}" stroke-width="1" stroke-dasharray="2 2"/>
        <line x1="10" y1="70" x2="90" y2="70" stroke="${c}" stroke-width="1" stroke-dasharray="2 2"/>
        
        <path d="M30 65 L60 65 L55 35 L25 35 Z" fill="none" stroke="${c}" stroke-width="2"/>
        <path d="M30 65 L45 80 L60 65" fill="none" stroke="${c}" stroke-width="2"/>
        <path d="M45 80 L55 35" fill="none" stroke="${c}" stroke-width="2"/>
        
        <rect x="70" y="25" width="10" height="40" fill="none" stroke="${c}" stroke-width="2"/>
        <line x1="70" y1="30" x2="80" y2="30" stroke="${c}" stroke-width="1"/>
        <line x1="70" y1="35" x2="80" y2="35" stroke="${c}" stroke-width="1"/>
        <line x1="70" y1="40" x2="80" y2="40" stroke="${c}" stroke-width="1"/>
      </svg>`;
    }
  }

  if (key === 'seas' || key === 'pirate_cove') {
    if (isDossier) {
      return `<svg viewBox="0 0 200 100" class="map-svg blueprint" style="opacity:${alpha}; stroke-linecap:round; stroke-linejoin:round; width:100%; height:100%; max-width: ${isDossier ? '200px' : '90px'};">
        <!-- Ocean Bounds & Wave Grid -->
        <rect x="20" y="15" width="160" height="70" fill="none" stroke="${c}" stroke-width="1.5" stroke-dasharray="2 3"/>
        <path d="M25 50 Q60 48 95 50 T165 50" fill="none" stroke="${c}" stroke-width="0.8" stroke-dasharray="1 3"/>

        <!-- West Galleon 'El Dorado' Hull & Quarterdeck -->
        <path d="M40 28 L62 30 L66 70 L44 72 Z" fill="none" stroke="${c}" stroke-width="1.8"/>
        <circle cx="53" cy="38" r="3" fill="none" stroke="${c}" stroke-width="1.2"/>
        <circle cx="53" cy="50" r="3.5" fill="none" stroke="${c}" stroke-width="1.4"/>
        <circle cx="53" cy="62" r="3" fill="none" stroke="${c}" stroke-width="1.2"/>
        <line x1="38" y1="50" x2="68" y2="50" stroke="${c}" stroke-width="1"/>

        <!-- East Clipper 'Invincible' Hull & Decks -->
        <path d="M138 30 L160 28 L156 72 L134 70 Z" fill="none" stroke="${c}" stroke-width="1.8"/>
        <circle cx="147" cy="38" r="3" fill="none" stroke="${c}" stroke-width="1.2"/>
        <circle cx="147" cy="50" r="3.5" fill="none" stroke="${c}" stroke-width="1.4"/>
        <circle cx="147" cy="62" r="3" fill="none" stroke="${c}" stroke-width="1.2"/>
        <line x1="132" y1="50" x2="162" y2="50" stroke="${c}" stroke-width="1"/>

        <!-- Central Shattered Mainmast Boarding Bridge -->
        <line x1="66" y1="50" x2="134" y2="50" stroke="${c}" stroke-width="2.5"/>
        <rect x="94" y="46" width="12" height="8" fill="none" stroke="${c}" stroke-width="1.2"/>
        <circle cx="100" cy="50" r="1.5" fill="${c}"/>

        <!-- Kraken Tentacles & Flotsam -->
        <path d="M96 26 Q108 18 102 12" fill="none" stroke="${c}" stroke-width="1.5"/>
        <path d="M104 74 Q112 82 106 88" fill="none" stroke="${c}" stroke-width="1.5"/>
        <circle cx="88" cy="36" r="2" fill="none" stroke="${c}" stroke-width="1"/>
        <circle cx="112" cy="64" r="2" fill="none" stroke="${c}" stroke-width="1"/>

        <text x="100" y="94" font-family="monospace" font-size="6" text-anchor="middle" fill="${c}">INK SEAS NAVAL CHART - 110m</text>
      </svg>`;
    } else {
      return `<svg viewBox="0 0 100 100" class="map-svg thumb" style="opacity:${alpha}; stroke-linecap:round; stroke-linejoin:round; width:100%; height:100%; max-width: 90px; max-height: 90px;">
        <!-- Waves -->
        <path d="M10 74 Q25 66 40 74 T70 74 T95 74" fill="none" stroke="${c}" stroke-width="2"/>
        <path d="M15 82 Q30 76 45 82 T75 82 T95 82" fill="none" stroke="${c}" stroke-width="1.5"/>

        <!-- Galleon Hull Silhouette -->
        <path d="M22 62 L32 74 L72 74 L80 62 Z" fill="none" stroke="${c}" stroke-width="2.5"/>
        <!-- Mainmast & Crow's Nest -->
        <line x1="50" y1="22" x2="50" y2="62" stroke="${c}" stroke-width="2.5"/>
        <line x1="34" y1="36" x2="66" y2="36" stroke="${c}" stroke-width="2"/>
        <line x1="38" y1="48" x2="62" y2="48" stroke="${c}" stroke-width="1.8"/>
        <rect x="46" y="30" width="8" height="6" fill="${c}"/>

        <!-- Jolly Roger Pennant -->
        <path d="M50 22 L62 27 L50 32 Z" fill="${c}"/>
        <!-- Kraken Tentacle Rise -->
        <path d="M82 72 Q92 56 86 44" fill="none" stroke="${c}" stroke-width="2"/>
      </svg>`;
    }
  } else if (key === 'clockwork') {
    if (isDossier) {
      return `<svg viewBox="0 0 200 100" class="map-svg blueprint" style="opacity:${alpha}; stroke-linecap:round; stroke-linejoin:round; width:100%; height:100%; max-width: ${isDossier ? '200px' : '90px'};">
        <circle cx="100" cy="50" r="40" fill="none" stroke="${c}" stroke-width="1.5" stroke-dasharray="2 4"/>
        
        <circle cx="100" cy="30" r="15" fill="none" stroke="${c}" stroke-width="1.5"/>
        <path d="M100 15 L100 45 M85 30 L115 30 M89.4 19.4 L110.6 40.6 M89.4 40.6 L110.6 19.4" stroke="${c}" stroke-width="1"/>
        <circle cx="100" cy="30" r="3" fill="${c}"/>

        <circle cx="70" cy="65" r="20" fill="none" stroke="${c}" stroke-width="1.5"/>
        <path d="M70 45 L70 85 M50 65 L90 65 M55.9 50.9 L84.1 79.1 M55.9 79.1 L84.1 50.9" stroke="${c}" stroke-width="1"/>
        <circle cx="70" cy="65" r="3" fill="${c}"/>

        <circle cx="130" cy="65" r="20" fill="none" stroke="${c}" stroke-width="1.5"/>
        <path d="M130 45 L130 85 M110 65 L150 65 M115.9 50.9 L144.1 79.1 M115.9 79.1 L144.1 50.9" stroke="${c}" stroke-width="1"/>
        <circle cx="130" cy="65" r="3" fill="${c}"/>

        <rect x="25" y="30" width="15" height="40" fill="none" stroke="${c}" stroke-width="1.5"/>
        <line x1="40" y1="40" x2="55" y2="40" stroke="${c}" stroke-width="1.5"/>
        <line x1="40" y1="60" x2="55" y2="60" stroke="${c}" stroke-width="1.5"/>

        <rect x="160" y="30" width="15" height="40" fill="none" stroke="${c}" stroke-width="1.5"/>
        <circle cx="167.5" cy="40" r="4" fill="none" stroke="${c}" stroke-width="1"/>
        <circle cx="167.5" cy="60" r="4" fill="none" stroke="${c}" stroke-width="1"/>

        <path d="M100 50 L100 85" stroke="${c}" stroke-width="2"/>
        <ellipse cx="100" cy="85" rx="8" ry="4" fill="none" stroke="${c}" stroke-width="2"/>
        <line x1="80" y1="15" x2="120" y2="15" stroke="${c}" stroke-width="0.5"/>
        <line x1="80" y1="13" x2="80" y2="17" stroke="${c}" stroke-width="0.5"/>
        <line x1="120" y1="13" x2="120" y2="17" stroke="${c}" stroke-width="0.5"/>
        <text x="100" y="12" font-family="monospace" font-size="6" text-anchor="middle" fill="${c}">110m</text>
      </svg>`;
    } else {
      return `<svg viewBox="0 0 100 100" class="map-svg thumb" style="opacity:${alpha}; stroke-linecap:round; stroke-linejoin:round; width:100%; height:100%; max-width: 90px; max-height: 90px;">
        <circle cx="50" cy="35" r="16" fill="none" stroke="${c}" stroke-width="2"/>
        <path d="M50 19 L50 51 M34 35 L66 35" stroke="${c}" stroke-width="1.5"/>
        <circle cx="50" cy="35" r="3" fill="${c}"/>
        
        <circle cx="35" cy="65" r="18" fill="none" stroke="${c}" stroke-width="2"/>
        <path d="M35 47 L35 83 M17 65 L53 65 M22.3 52.3 L47.7 77.7 M22.3 77.7 L47.7 52.3" stroke="${c}" stroke-width="1.5"/>
        <circle cx="35" cy="65" r="3" fill="${c}"/>

        <circle cx="65" cy="65" r="18" fill="none" stroke="${c}" stroke-width="2"/>
        <path d="M65 47 L65 83 M47 65 L83 65 M52.3 52.3 L77.7 77.7 M52.3 77.7 L77.7 52.3" stroke="${c}" stroke-width="1.5"/>
        <circle cx="65" cy="65" r="3" fill="${c}"/>

        <line x1="10" y1="40" x2="20" y2="40" stroke="${c}" stroke-width="2"/>
        <line x1="10" y1="60" x2="20" y2="60" stroke="${c}" stroke-width="2"/>
        <line x1="80" y1="40" x2="90" y2="40" stroke="${c}" stroke-width="2"/>
        <line x1="80" y1="60" x2="90" y2="60" stroke="${c}" stroke-width="2"/>
      </svg>`;
    }
  } else if (key === 'castle') {
    if (isDossier) {
      return `<svg viewBox="0 0 200 100" class="map-svg blueprint" style="opacity:${alpha}; stroke-linecap:round; stroke-linejoin:round; width:100%; height:100%; max-width: ${isDossier ? '200px' : '90px'};">
        <!-- Medieval Moat Perimeter -->
        <rect x="25" y="15" width="150" height="70" fill="none" stroke="${c}" stroke-width="1.8" stroke-dasharray="3 3"/>
        <!-- Central Keep / Donjon Fortress -->
        <rect x="75" y="32" width="50" height="36" fill="none" stroke="${c}" stroke-width="2"/>
        <rect x="85" y="40" width="30" height="20" fill="none" stroke="${c}" stroke-width="1.5"/>
        <circle cx="100" cy="50" r="3" fill="${c}"/>
        <!-- 4 Corner Bastion Turrets -->
        <rect x="68" y="26" width="14" height="14" fill="none" stroke="${c}" stroke-width="1.5"/>
        <rect x="118" y="26" width="14" height="14" fill="none" stroke="${c}" stroke-width="1.5"/>
        <rect x="68" y="60" width="14" height="14" fill="none" stroke="${c}" stroke-width="1.5"/>
        <rect x="118" y="60" width="14" height="14" fill="none" stroke="${c}" stroke-width="1.5"/>
        <!-- Drawbridges North & South -->
        <line x1="100" y1="15" x2="100" y2="32" stroke="${c}" stroke-width="2.5"/>
        <line x1="100" y1="68" x2="100" y2="85" stroke="${c}" stroke-width="2.5"/>
        <!-- Outer Moat Barbicans -->
        <circle cx="50" cy="50" r="8" fill="none" stroke="${c}" stroke-width="1.2"/>
        <circle cx="150" cy="50" r="8" fill="none" stroke="${c}" stroke-width="1.2"/>
        <text x="100" y="94" font-family="monospace" font-size="6" text-anchor="middle" fill="${c}">110m MEDIEVAL BASTION</text>
      </svg>`;
    } else {
      return `<svg viewBox="0 0 100 100" class="map-svg thumb" style="opacity:${alpha}; stroke-linecap:round; stroke-linejoin:round; width:100%; height:100%; max-width: 90px; max-height: 90px;">
        <!-- Stone Ground Line -->
        <line x1="10" y1="85" x2="90" y2="85" stroke="${c}" stroke-width="2.5"/>
        <!-- Castle Towers and Crenellations -->
        <path d="M20 85 L20 40 L26 40 L26 46 L32 46 L32 40 L38 40 L38 85" fill="none" stroke="${c}" stroke-width="2"/>
        <path d="M62 85 L62 40 L68 40 L68 46 L74 46 L74 40 L80 40 L80 85" fill="none" stroke="${c}" stroke-width="2"/>
        <!-- Central Donjon Keep -->
        <path d="M38 58 L44 58 L44 52 L50 52 L50 58 L56 58 L56 52 L62 52 L62 58" fill="none" stroke="${c}" stroke-width="2"/>
        <!-- Arched Portcullis Gate -->
        <path d="M44 85 L44 68 Q50 62 56 68 L56 85" fill="none" stroke="${c}" stroke-width="2"/>
        <!-- Turret Pennants -->
        <line x1="29" y1="40" x2="29" y2="28" stroke="${c}" stroke-width="1.5"/>
        <path d="M29 28 L37 32 L29 36 Z" fill="${c}"/>
        <line x1="71" y1="40" x2="71" y2="28" stroke="${c}" stroke-width="1.5"/>
        <path d="M71 28 L79 32 L71 36 Z" fill="${c}"/>
      </svg>`;
    }
  } else if (key === 'zen') {
    if (isDossier) {
      return `<svg viewBox="0 0 200 100" class="map-svg blueprint" style="opacity:${alpha}; stroke-linecap:round; stroke-linejoin:round; width:100%; height:100%; max-width: ${isDossier ? '200px' : '90px'};">
        <!-- River stream and bridge -->
        <path d="M20 20 Q100 15 180 20" fill="none" stroke="${c}" stroke-width="1.5" stroke-dasharray="2 2"/>
        <path d="M90 15 L110 15 L108 25 L92 25 Z" fill="none" stroke="${c}" stroke-width="1.5"/>
        <path d="M100 8 L100 15" stroke="${c}" stroke-width="1.5"/>
        <path d="M92 10 L108 10" stroke="${c}" stroke-width="2"/>

        <!-- Central Sanju-no-to Pagoda -->
        <rect x="85" y="40" width="30" height="30" fill="none" stroke="${c}" stroke-width="2"/>
        <rect x="90" y="45" width="20" height="20" fill="none" stroke="${c}" stroke-width="1.5"/>
        <rect x="94" y="49" width="12" height="12" fill="none" stroke="${c}" stroke-width="1"/>
        <circle cx="100" cy="55" r="2" fill="${c}"/>
        <!-- Flared roof corners -->
        <line x1="82" y1="37" x2="88" y2="43" stroke="${c}" stroke-width="1.5"/>
        <line x1="118" y1="37" x2="112" y2="43" stroke="${c}" stroke-width="1.5"/>
        <line x1="82" y1="73" x2="88" y2="67" stroke="${c}" stroke-width="1.5"/>
        <line x1="118" y1="73" x2="112" y2="67" stroke="${c}" stroke-width="1.5"/>

        <!-- West Bamboo Grove -->
        <circle cx="45" cy="45" r="1.5" fill="${c}"/>
        <circle cx="55" cy="40" r="1.5" fill="${c}"/>
        <circle cx="40" cy="55" r="1.5" fill="${c}"/>
        <circle cx="50" cy="60" r="1.5" fill="${c}"/>
        <circle cx="60" cy="52" r="1.5" fill="${c}"/>
        <path d="M35 35 Q48 52 40 70" fill="none" stroke="${c}" stroke-width="0.8" stroke-dasharray="2 2"/>

        <!-- East Karesansui Gravel Ocean & Sentinel Megaliths -->
        <ellipse cx="150" cy="55" rx="18" ry="12" fill="none" stroke="${c}" stroke-width="0.8" stroke-dasharray="2 3"/>
        <ellipse cx="150" cy="55" rx="12" ry="8" fill="none" stroke="${c}" stroke-width="0.8" stroke-dasharray="2 3"/>
        <rect x="146" y="51" width="8" height="8" rx="2" fill="${c}"/>
        <circle cx="140" cy="58" r="2.5" fill="${c}"/>
        <circle cx="158" cy="50" r="2" fill="${c}"/>
        <!-- Northeast War Fan Jump-Pad -->
        <path d="M140 32 L152 24 A12 12 0 0 1 156 36 Z" fill="none" stroke="${c}" stroke-width="1.2"/>

        <!-- South Tea Pavilion -->
        <rect x="92" y="80" width="16" height="12" fill="none" stroke="${c}" stroke-width="1.5"/>
        <line x1="90" y1="78" x2="110" y2="78" stroke="${c}" stroke-width="2"/>

        <text x="100" y="98" font-family="monospace" font-size="6" text-anchor="middle" fill="${c}">110m SANCTUARY</text>
      </svg>`;
    } else {
      return `<svg viewBox="0 0 100 100" class="map-svg thumb" style="opacity:${alpha}; stroke-linecap:round; stroke-linejoin:round; width:100%; height:100%; max-width: 90px; max-height: 90px;">
        <!-- Pagoda roof tiers -->
        <path d="M15 42 Q50 34 85 42" fill="none" stroke="${c}" stroke-width="2.5"/>
        <path d="M25 58 Q50 50 75 58" fill="none" stroke="${c}" stroke-width="2.5"/>
        <path d="M32 74 Q50 68 68 74" fill="none" stroke="${c}" stroke-width="2.5"/>

        <!-- Central tower structure -->
        <line x1="38" y1="42" x2="38" y2="85" stroke="${c}" stroke-width="1.5"/>
        <line x1="62" y1="42" x2="62" y2="85" stroke="${c}" stroke-width="1.5"/>
        <line x1="20" y1="85" x2="80" y2="85" stroke="${c}" stroke-width="2"/>

        <!-- Sōrin Calligraphy Brush Spire -->
        <line x1="50" y1="12" x2="50" y2="36" stroke="${c}" stroke-width="2"/>
        <circle cx="50" cy="12" r="2.5" fill="${c}"/>
        <circle cx="50" cy="20" r="1.5" fill="none" stroke="${c}" stroke-width="1"/>
        <circle cx="50" cy="25" r="2" fill="none" stroke="${c}" stroke-width="1"/>
        <circle cx="50" cy="30" r="2.5" fill="none" stroke="${c}" stroke-width="1"/>

        <!-- Torii Accent -->
        <path d="M12 28 L28 26" stroke="${c}" stroke-width="1.5"/>
        <path d="M15 28 L15 36 M25 27 L25 36" stroke="${c}" stroke-width="1.2"/>
      </svg>`;
    }
  } else if (key === 'mexico') {
    if (isDossier) {
      return `<svg viewBox="0 0 200 100" class="map-svg blueprint" style="opacity:${alpha}; stroke-linecap:round; stroke-linejoin:round; width:100%; height:100%; max-width: ${isDossier ? '200px' : '90px'};">
        <!-- Sun-baked Plaza Perimeter -->
        <rect x="25" y="15" width="150" height="70" fill="none" stroke="${c}" stroke-width="1.8"/>
        <!-- Central Gazebo / Kiosko Fountain -->
        <circle cx="100" cy="50" r="16" fill="none" stroke="${c}" stroke-width="1.8"/>
        <circle cx="100" cy="50" r="5" fill="${c}"/>
        <!-- Radiating Avenidas -->
        <line x1="45" y1="50" x2="84" y2="50" stroke="${c}" stroke-width="1.5"/>
        <line x1="116" y1="50" x2="155" y2="50" stroke="${c}" stroke-width="1.5"/>
        <line x1="100" y1="20" x2="100" y2="34" stroke="${c}" stroke-width="1.5"/>
        <line x1="100" y1="66" x2="100" y2="80" stroke="${c}" stroke-width="1.5"/>
        <!-- Adobe Cantinas & Arcades -->
        <rect x="35" y="24" width="22" height="18" fill="none" stroke="${c}" stroke-width="1.2"/>
        <rect x="143" y="24" width="22" height="18" fill="none" stroke="${c}" stroke-width="1.2"/>
        <rect x="35" y="58" width="22" height="18" fill="none" stroke="${c}" stroke-width="1.2"/>
        <rect x="143" y="58" width="22" height="18" fill="none" stroke="${c}" stroke-width="1.2"/>
        <!-- Saguaro Cacti Markers -->
        <path d="M72 32 L72 40 M68 35 L76 35" stroke="${c}" stroke-width="1.5"/>
        <path d="M128 68 L128 76 M124 71 L132 71" stroke="${c}" stroke-width="1.5"/>
        <text x="100" y="94" font-family="monospace" font-size="6" text-anchor="middle" fill="${c}">110m SUN-BAKED PLAZA</text>
      </svg>`;
    } else {
      return `<svg viewBox="0 0 100 100" class="map-svg thumb" style="opacity:${alpha}; stroke-linecap:round; stroke-linejoin:round; width:100%; height:100%; max-width: 90px; max-height: 90px;">
        <!-- Sun -->
        <circle cx="50" cy="32" r="12" fill="none" stroke="${c}" stroke-width="2"/>
        <line x1="50" y1="14" x2="50" y2="8" stroke="${c}" stroke-width="2"/>
        <line x1="34" y1="22" x2="28" y2="18" stroke="${c}" stroke-width="2"/>
        <line x1="66" y1="22" x2="72" y2="18" stroke="${c}" stroke-width="2"/>
        <!-- Ground Horizon Line -->
        <line x1="10" y1="80" x2="90" y2="80" stroke="${c}" stroke-width="2.5"/>
        <!-- Saguaro Cactus -->
        <line x1="35" y1="42" x2="35" y2="80" stroke="${c}" stroke-width="3"/>
        <path d="M25 54 L35 54 M25 46 L25 54" fill="none" stroke="${c}" stroke-width="2.5"/>
        <path d="M35 62 L45 62 M45 52 L45 62" fill="none" stroke="${c}" stroke-width="2.5"/>
        <!-- Sombrero / Cantina Arch -->
        <path d="M54 75 Q68 62 82 75" fill="none" stroke="${c}" stroke-width="2"/>
        <path d="M50 78 L86 78" stroke="${c}" stroke-width="2.5"/>
      </svg>`;
    }
  } else if (key === 'library') {
    if (isDossier) {
      return `<svg viewBox="0 0 200 100" class="map-svg blueprint" style="opacity:${alpha}; stroke-linecap:round; stroke-linejoin:round; width:100%; height:100%; max-width: ${isDossier ? '200px' : '90px'};">
        <!-- Grand Desk Arena -->
        <rect x="55" y="25" width="90" height="50" fill="none" stroke="${c}" stroke-width="1.8"/>
        <!-- Central Inkwell -->
        <circle cx="100" cy="50" r="8" fill="none" stroke="${c}" stroke-width="1.5"/>
        <line x1="97" y1="46" x2="114" y2="35" stroke="${c}" stroke-width="1.2"/>
        <!-- Open Book Ramps North & South -->
        <path d="M85 25 L100 15 L115 25" fill="none" stroke="${c}" stroke-width="1.2"/>
        <path d="M85 75 L100 85 L115 75" fill="none" stroke="${c}" stroke-width="1.2"/>
        <!-- West Bookcase Tier Stacks -->
        <rect x="20" y="20" width="22" height="28" fill="none" stroke="${c}" stroke-width="1.5"/>
        <rect x="18" y="52" width="24" height="28" fill="none" stroke="${c}" stroke-width="1.5"/>
        <line x1="42" y1="34" x2="55" y2="40" stroke="${c}" stroke-dasharray="2 2" stroke-width="1"/>
        <!-- East Under-Desk Catacombs -->
        <line x1="155" y1="30" x2="185" y2="30" stroke="${c}" stroke-dasharray="3 3" stroke-width="1.5"/>
        <line x1="155" y1="70" x2="185" y2="70" stroke="${c}" stroke-dasharray="3 3" stroke-width="1.5"/>
        <circle cx="170" cy="50" r="12" fill="none" stroke="${c}" stroke-width="1.2"/>
        <!-- Desk Lamps -->
        <circle cx="68" cy="32" r="4" fill="${c}"/>
        <circle cx="132" cy="68" r="4" fill="${c}"/>
        <text x="100" y="96" font-family="monospace" font-size="6" text-anchor="middle" fill="${c}">112m COLOSSAL STUDY</text>
      </svg>`;
    } else {
      return `<svg viewBox="0 0 100 100" class="map-svg thumb" style="opacity:${alpha}; stroke-linecap:round; stroke-linejoin:round; width:100%; height:100%; max-width: 90px; max-height: 90px;">
        <!-- Stacked books icon -->
        <rect x="25" y="65" width="50" height="12" rx="2" fill="none" stroke="${c}" stroke-width="2"/>
        <rect x="30" y="50" width="45" height="12" rx="2" fill="none" stroke="${c}" stroke-width="2"/>
        <rect x="22" y="35" width="55" height="12" rx="2" fill="none" stroke="${c}" stroke-width="2"/>
        <!-- Desk Lamp Silhouette -->
        <path d="M72 65 Q85 30 65 20 L58 26" fill="none" stroke="${c}" stroke-width="2"/>
        <path d="M52 22 L66 16 L62 30 Z" fill="${c}"/>
        <!-- Quill -->
        <line x1="28" y1="28" x2="42" y2="12" stroke="${c}" stroke-width="1.5"/>
      </svg>`;
    }
  } else if (key === 'paradise') {
    if (isDossier) {
      return `<svg viewBox="0 0 200 100" class="map-svg blueprint" style="opacity:${alpha}; stroke-linecap:round; stroke-linejoin:round; width:100%; height:100%; max-width: ${isDossier ? '200px' : '90px'};">
        <!-- Paradise Oasis / Haven Blueprint -->
        <rect x="25" y="15" width="150" height="70" fill="none" stroke="${c}" stroke-width="1.8"/>
        <!-- Central Sanctuary Core -->
        <circle cx="100" cy="50" r="18" fill="none" stroke="${c}" stroke-width="1.5"/>
        <circle cx="100" cy="50" r="6" fill="${c}"/>
        <!-- Stepped terraces & walkways -->
        <line x1="45" y1="50" x2="82" y2="50" stroke="${c}" stroke-width="1.5"/>
        <line x1="118" y1="50" x2="155" y2="50" stroke="${c}" stroke-width="1.5"/>
        <line x1="100" y1="20" x2="100" y2="32" stroke="${c}" stroke-width="1.5"/>
        <line x1="100" y1="68" x2="100" y2="80" stroke="${c}" stroke-width="1.5"/>
        <!-- Corner bastion perches -->
        <rect x="35" y="25" width="16" height="16" fill="none" stroke="${c}" stroke-width="1.2"/>
        <rect x="149" y="25" width="16" height="16" fill="none" stroke="${c}" stroke-width="1.2"/>
        <rect x="35" y="59" width="16" height="16" fill="none" stroke="${c}" stroke-width="1.2"/>
        <rect x="149" y="59" width="16" height="16" fill="none" stroke="${c}" stroke-width="1.2"/>
        <text x="100" y="94" font-family="monospace" font-size="6" text-anchor="middle" fill="${c}">PARADISE SECTOR - 110m</text>
      </svg>`;
    } else {
      return `<svg viewBox="0 0 100 100" class="map-svg thumb" style="opacity:${alpha}; stroke-linecap:round; stroke-linejoin:round; width:100%; height:100%; max-width: 90px; max-height: 90px;">
        <!-- Sun & Oasis Haven -->
        <circle cx="50" cy="38" r="14" fill="none" stroke="${c}" stroke-width="2"/>
        <path d="M50 56 L50 82" stroke="${c}" stroke-width="3"/>
        <path d="M30 64 Q50 58 70 64" fill="none" stroke="${c}" stroke-width="2"/>
        <path d="M22 74 Q50 68 78 74" fill="none" stroke="${c}" stroke-width="2"/>
        <line x1="50" y1="18" x2="50" y2="12" stroke="${c}" stroke-width="2"/>
        <line x1="32" y1="24" x2="26" y2="18" stroke="${c}" stroke-width="2"/>
        <line x1="68" y1="24" x2="74" y2="18" stroke="${c}" stroke-width="2"/>
      </svg>`;
    }
  } else if (key === 'forest') {
    if (isDossier) {
      return `<svg viewBox="0 0 200 100" class="map-svg blueprint" style="opacity:${alpha}; stroke-linecap:round; stroke-linejoin:round; width:100%; height:100%; max-width: ${isDossier ? '200px' : '90px'};">
        <!-- Forest Perimeter Bounds -->
        <rect x="25" y="15" width="150" height="70" fill="none" stroke="${c}" stroke-width="1.8"/>
        <!-- Central Arbor Core / Ancient Tree Dais -->
        <circle cx="100" cy="50" r="16" fill="none" stroke="${c}" stroke-width="1.8"/>
        <circle cx="100" cy="50" r="5" fill="${c}"/>
        <!-- Canopy Bridges -->
        <line x1="50" y1="50" x2="84" y2="50" stroke="${c}" stroke-width="1.5"/>
        <line x1="116" y1="50" x2="150" y2="50" stroke="${c}" stroke-width="1.5"/>
        <line x1="100" y1="20" x2="100" y2="34" stroke="${c}" stroke-width="1.5"/>
        <line x1="100" y1="66" x2="100" y2="80" stroke="${c}" stroke-width="1.5"/>
        <!-- Pine Tree Groves -->
        <path d="M45 32 L50 22 L55 32 Z M42 40 L50 30 L58 40 Z" fill="none" stroke="${c}" stroke-width="1.2"/>
        <path d="M145 32 L150 22 L155 32 Z M142 40 L150 30 L158 40 Z" fill="none" stroke="${c}" stroke-width="1.2"/>
        <path d="M45 68 L50 58 L55 68 Z M42 76 L50 66 L58 76 Z" fill="none" stroke="${c}" stroke-width="1.2"/>
        <path d="M145 68 L150 58 L155 68 Z M142 76 L150 66 L158 76 Z" fill="none" stroke="${c}" stroke-width="1.2"/>
        <text x="100" y="94" font-family="monospace" font-size="6" text-anchor="middle" fill="${c}">INK FOREST CANOPY - 110m</text>
      </svg>`;
    } else {
      return `<svg viewBox="0 0 100 100" class="map-svg thumb" style="opacity:${alpha}; stroke-linecap:round; stroke-linejoin:round; width:100%; height:100%; max-width: 90px; max-height: 90px;">
        <!-- Forest Ground Line -->
        <line x1="15" y1="80" x2="85" y2="80" stroke="${c}" stroke-width="2.5"/>
        <!-- Central Sprawling Pine Tree -->
        <line x1="50" y1="45" x2="50" y2="80" stroke="${c}" stroke-width="2.5"/>
        <path d="M50 20 L36 42 L42 42 L30 62 L44 62 L50 62 L56 62 L70 62 L58 42 L64 42 Z" fill="none" stroke="${c}" stroke-width="2"/>
        <!-- Background Pines -->
        <path d="M28 40 L18 56 L24 56 L15 72 L41 72 L32 56 L38 56 Z" fill="none" stroke="${c}" stroke-width="1.5"/>
        <path d="M72 40 L62 56 L68 56 L59 72 L85 72 L76 56 L82 56 Z" fill="none" stroke="${c}" stroke-width="1.5"/>
      </svg>`;
    }
  } else if (key === 'space_station' || key === 'station') {
    if (isDossier) {
      return `<svg viewBox="0 0 200 100" class="map-svg blueprint" style="opacity:${alpha}; stroke-linecap:round; stroke-linejoin:round; width:100%; height:100%; max-width: ${isDossier ? '200px' : '90px'};">
        <!-- Station Centrifuge Ring & Hab Torus -->
        <circle cx="100" cy="50" r="28" fill="none" stroke="${c}" stroke-width="1.8"/>
        <circle cx="100" cy="50" r="10" fill="none" stroke="${c}" stroke-width="1.5"/>
        <circle cx="100" cy="50" r="3" fill="${c}"/>
        <!-- Radial Connecting Spokes -->
        <line x1="100" y1="22" x2="100" y2="78" stroke="${c}" stroke-width="1.5"/>
        <line x1="72" y1="50" x2="128" y2="50" stroke="${c}" stroke-width="1.5"/>
        <!-- Photovoltaic Solar Array Wings -->
        <rect x="18" y="38" width="42" height="24" fill="none" stroke="${c}" stroke-width="1.5"/>
        <line x1="28" y1="38" x2="28" y2="62" stroke="${c}" stroke-width="0.8"/>
        <line x1="39" y1="38" x2="39" y2="62" stroke="${c}" stroke-width="0.8"/>
        <line x1="50" y1="38" x2="50" y2="62" stroke="${c}" stroke-width="0.8"/>
        <rect x="140" y="38" width="42" height="24" fill="none" stroke="${c}" stroke-width="1.5"/>
        <line x1="150" y1="38" x2="150" y2="62" stroke="${c}" stroke-width="0.8"/>
        <line x1="161" y1="38" x2="161" y2="62" stroke="${c}" stroke-width="0.8"/>
        <line x1="172" y1="38" x2="172" y2="62" stroke="${c}" stroke-width="0.8"/>
        <!-- Comms Dish Mast -->
        <path d="M92 14 Q100 8 108 14" fill="none" stroke="${c}" stroke-width="1.5"/>
        <line x1="100" y1="11" x2="100" y2="22" stroke="${c}" stroke-width="1.2"/>
        <text x="100" y="94" font-family="monospace" font-size="6" text-anchor="middle" fill="${c}">ORBITAL CENTRIFUGE HABITAT - 120m</text>
      </svg>`;
    } else {
      return `<svg viewBox="0 0 100 100" class="map-svg thumb" style="opacity:${alpha}; stroke-linecap:round; stroke-linejoin:round; width:100%; height:100%; max-width: 90px; max-height: 90px;">
        <!-- Habitat Torus Hub -->
        <circle cx="50" cy="50" r="16" fill="none" stroke="${c}" stroke-width="2"/>
        <circle cx="50" cy="50" r="5" fill="${c}"/>
        <!-- Radial Spokes -->
        <line x1="50" y1="34" x2="50" y2="66" stroke="${c}" stroke-width="1.5"/>
        <line x1="34" y1="50" x2="66" y2="50" stroke="${c}" stroke-width="1.5"/>
        <!-- Dual Solar Array Panels -->
        <rect x="10" y="42" width="22" height="16" rx="1" fill="none" stroke="${c}" stroke-width="1.8"/>
        <line x1="21" y1="42" x2="21" y2="58" stroke="${c}" stroke-width="1"/>
        <rect x="68" y="42" width="22" height="16" rx="1" fill="none" stroke="${c}" stroke-width="1.8"/>
        <line x1="79" y1="42" x2="79" y2="58" stroke="${c}" stroke-width="1"/>
        <!-- Orbiting Stars -->
        <circle cx="28" cy="22" r="1.5" fill="${c}"/>
        <circle cx="76" cy="24" r="1.5" fill="${c}"/>
        <circle cx="24" cy="76" r="1.5" fill="${c}"/>
        <circle cx="74" cy="78" r="1.5" fill="${c}"/>
      </svg>`;
    }
  } else if (key === 'bus_station') {
    if (isDossier) {
      return `<svg viewBox="0 0 200 100" class="map-svg blueprint" style="opacity:${alpha}; stroke-linecap:round; stroke-linejoin:round; width:100%; height:100%; max-width: ${isDossier ? '200px' : '90px'};">
        <!-- Station Perimeter Terminal & Cantilever Concourse -->
        <rect x="25" y="15" width="150" height="70" rx="3" fill="none" stroke="${c}" stroke-width="1.8"/>
        <!-- Central Clock Tower & Hub -->
        <rect x="92" y="42" width="16" height="16" fill="none" stroke="${c}" stroke-width="1.5"/>
        <circle cx="100" cy="50" r="5" fill="none" stroke="${c}" stroke-width="1.2"/>
        <line x1="100" y1="47" x2="100" y2="50" stroke="${c}" stroke-width="1.2"/>
        <line x1="100" y1="50" x2="103" y2="50" stroke="${c}" stroke-width="1.2"/>
        <!-- Bus Bay Alpha & Commuter Coach (West) -->
        <rect x="42" y="28" width="36" height="16" rx="2" fill="none" stroke="${c}" stroke-width="1.6"/>
        <rect x="45" y="31" width="30" height="4" fill="none" stroke="${c}" stroke-width="0.8"/>
        <line x1="52" y1="44" x2="52" y2="47" stroke="${c}" stroke-width="2"/>
        <line x1="68" y1="44" x2="68" y2="47" stroke="${c}" stroke-width="2"/>
        <text x="60" y="40" font-family="monospace" font-size="5" text-anchor="middle" fill="${c}">BUS ALPHA</text>
        <!-- Bus Bay Beta & Commuter Coach (East) -->
        <rect x="122" y="56" width="36" height="16" rx="2" fill="none" stroke="${c}" stroke-width="1.6"/>
        <rect x="125" y="59" width="30" height="4" fill="none" stroke="${c}" stroke-width="0.8"/>
        <line x1="132" y1="72" x2="132" y2="75" stroke="${c}" stroke-width="2"/>
        <line x1="148" y1="72" x2="148" y2="75" stroke="${c}" stroke-width="2"/>
        <text x="140" y="68" font-family="monospace" font-size="5" text-anchor="middle" fill="${c}">BUS BETA</text>
        <!-- Pedestrian Concourse Skybridge -->
        <line x1="30" y1="50" x2="170" y2="50" stroke="${c}" stroke-width="1.5" stroke-dasharray="4 2"/>
        <!-- Passenger Shelters & Benches -->
        <line x1="42" y1="20" x2="78" y2="20" stroke="${c}" stroke-width="2"/>
        <line x1="122" y1="80" x2="158" y2="80" stroke="${c}" stroke-width="2"/>
        <text x="100" y="93" font-family="monospace" font-size="6" text-anchor="middle" fill="${c}">CENTRAL BUS TERMINAL &amp; TRANSIT BAYS</text>
      </svg>`;
    } else {
      return `<svg viewBox="0 0 100 100" class="map-svg thumb" style="opacity:${alpha}; stroke-linecap:round; stroke-linejoin:round; width:100%; height:100%; max-width: 90px; max-height: 90px;">
        <!-- Terminal Concourse Outer Rim -->
        <rect x="14" y="14" width="72" height="72" rx="4" fill="none" stroke="${c}" stroke-width="1.8"/>
        <!-- Central Clock Spire -->
        <circle cx="50" cy="50" r="10" fill="none" stroke="${c}" stroke-width="1.5"/>
        <line x1="50" y1="44" x2="50" y2="50" stroke="${c}" stroke-width="1.2"/>
        <line x1="50" y1="50" x2="55" y2="50" stroke="${c}" stroke-width="1.2"/>
        <!-- Commuter Coach Body -->
        <rect x="24" y="24" width="22" height="12" rx="1.5" fill="none" stroke="${c}" stroke-width="1.6"/>
        <circle cx="28" cy="36" r="2" fill="${c}"/>
        <circle cx="42" cy="36" r="2" fill="${c}"/>
        <rect x="54" y="64" width="22" height="12" rx="1.5" fill="none" stroke="${c}" stroke-width="1.6"/>
        <circle cx="58" cy="76" r="2" fill="${c}"/>
        <circle cx="72" cy="76" r="2" fill="${c}"/>
        <!-- Boarding Arrows -->
        <line x1="50" y1="18" x2="50" y2="34" stroke="${c}" stroke-width="1" stroke-dasharray="2 2"/>
        <line x1="50" y1="66" x2="50" y2="82" stroke="${c}" stroke-width="1" stroke-dasharray="2 2"/>
      </svg>`;
    }
  } else if (key === 'retro_arcade') {
    if (isDossier) {
      return `<svg viewBox="0 0 200 100" class="map-svg blueprint" style="opacity:${alpha}; stroke-linecap:round; stroke-linejoin:round; width:100%; height:100%; max-width: ${isDossier ? '200px' : '90px'};">
        <!-- Pinball Playfield Outer Chassis -->
        <polygon points="75,95 125,95 135,25 65,25" fill="none" stroke="${c}" stroke-width="1.8"/>
        <!-- Scoreboard Backglass Head -->
        <rect x="60" y="8" width="80" height="17" rx="2" fill="none" stroke="${c}" stroke-width="1.6"/>
        <text x="100" y="20" font-family="monospace" font-size="7" text-anchor="middle" fill="${c}">HIGH SCORE</text>
        <!-- Flipper Apron & Pop Bumpers -->
        <circle cx="88" cy="45" r="5" fill="none" stroke="${c}" stroke-width="1.2"/>
        <circle cx="112" cy="45" r="5" fill="none" stroke="${c}" stroke-width="1.2"/>
        <circle cx="100" cy="35" r="6" fill="none" stroke="${c}" stroke-width="1.2"/>
        <line x1="85" y1="88" x2="96" y2="83" stroke="${c}" stroke-width="2"/>
        <line x1="115" y1="88" x2="104" y2="83" stroke="${c}" stroke-width="2"/>
        <!-- Vector CRT Pit (West) -->
        <rect x="10" y="25" width="40" height="55" rx="3" fill="none" stroke="${c}" stroke-width="1.4" stroke-dasharray="3 2"/>
        <text x="30" y="55" font-family="monospace" font-size="5" text-anchor="middle" fill="${c}">VECTOR PIT</text>
        <!-- Skee-Ball & Air Hockey (East) -->
        <rect x="150" y="25" width="40" height="55" rx="3" fill="none" stroke="${c}" stroke-width="1.4" stroke-dasharray="3 2"/>
        <text x="170" y="55" font-family="monospace" font-size="5" text-anchor="middle" fill="${c}">RHYTHM / HOCKEY</text>
      </svg>`;
    } else {
      return `<svg viewBox="0 0 100 100" class="map-svg thumb" style="opacity:${alpha}; stroke-linecap:round; stroke-linejoin:round; width:100%; height:100%; max-width: 90px; max-height: 90px;">
        <!-- Tilted Pinball Table Body -->
        <polygon points="32,90 68,90 76,30 24,30" fill="none" stroke="${c}" stroke-width="1.8"/>
        <!-- Backbox Scoreboard -->
        <rect x="20" y="14" width="60" height="16" rx="2" fill="none" stroke="${c}" stroke-width="1.6"/>
        <text x="50" y="25" font-family="monospace" font-size="6" text-anchor="middle" fill="${c}">80s ARCADE</text>
        <!-- Pop Bumpers & Solenoids -->
        <circle cx="42" cy="50" r="4" fill="none" stroke="${c}" stroke-width="1.2"/>
        <circle cx="58" cy="50" r="4" fill="none" stroke="${c}" stroke-width="1.2"/>
        <circle cx="50" cy="40" r="5" fill="none" stroke="${c}" stroke-width="1.2"/>
        <line x1="40" y1="84" x2="48" y2="80" stroke="${c}" stroke-width="2"/>
        <line x1="60" y1="84" x2="52" y2="80" stroke="${c}" stroke-width="2"/>
      </svg>`;
    }
  } else {
    const curLevel = LEVELS.find((m) => m.key === key);
    return synthesizeMapSVG({ id: key, name: curLevel?.name || key, palette: curLevel?.env || '' }, isDossier);
  }
  return `<svg viewBox="0 0 100 100" class="map-svg" style="opacity:${alpha}; stroke-linecap:round; stroke-linejoin:round; width:100%; height:100%; max-width: ${isDossier ? '140px' : '90px'}; max-height: ${isDossier ? '140px' : '90px'};">${paths}</svg>`;
}
