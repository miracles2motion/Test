import { getMapSVG } from './map-svgs.js';
import { esc } from './util.js';

export function settingsScreenHTML(ctx) {
  const { LEVELS, mapKey, game, window, arenaFormat, best, bestForMap, bestWaveForMap, musicWanted, renderQuality, isAppInstalled, deferredPrompt, mobile, player, previewWeaponType, previewWeaponInst, cameraFov, lobby, FFA_TARGET, FFA_TIME, net, myName, scores, version, getPlayableMaps, Object } = ctx;

  const isGameActive = settingsReturnTo === 'pause' || (typeof game !== 'undefined' && game.state === 'play' && !game.over);
  const currentDpi = (typeof R !== 'undefined' && R.pixelRatio) ? R.pixelRatio.toFixed(2) : '1.50';
  const currentWidth = (typeof R !== 'undefined' && R.rt) ? R.rt.width : Math.round(window.innerWidth * ((typeof window !== 'undefined' && window.devicePixelRatio) || 1));
  const currentHeight = (typeof R !== 'undefined' && R.rt) ? R.rt.height : Math.round(window.innerHeight * ((typeof window !== 'undefined' && window.devicePixelRatio) || 1));

  return `<div class="ds-panel modal" id="settingsScreen" style="width: 800px; max-width: 95vw; margin: auto; max-height: 90vh; overflow-y: auto;">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
      <h1 style="margin: 0; font-family: var(--font-display); font-size: 32px;">SETTINGS</h1>
      <button type="button" class="ds-btn icon ghost" id="closeSettingsX" style="font-size:24px;">✕</button>
    </div>

    <!-- TABS -->
    <div style="display: flex; gap: 16px; border-bottom: 2px solid var(--ink); margin-bottom: 24px;">
      <div class="ds-tabs" style="display:flex; gap:16px;">
        <button type="button" class="tab-btn ds-btn ghost ${settingsTab === 'camera' ? 'active' : ''}" data-tab="camera">CONTROLS</button>
        <button type="button" class="tab-btn ds-btn ghost ${settingsTab === 'graphics' ? 'active' : ''}" data-tab="graphics">GRAPHICS${isGameActive ? ' 🔒' : ''}</button>
        <button type="button" class="tab-btn ds-btn ghost ${settingsTab === 'touch' ? 'active' : ''}" data-tab="touch">LAYOUT</button>
        <button type="button" class="tab-btn ds-btn ghost ${settingsTab === 'audio' ? 'active' : ''}" data-tab="audio">AUDIO</button>
      </div>
    </div>

    <div class="settings-body">
      <!-- 1. GRAPHICS -->
      <div class="tab-pane ${settingsTab === 'graphics' ? 'active' : ''}" id="pane-graphics" style="${settingsTab === 'graphics' ? 'display:block' : 'display:none'}">
        ${isGameActive ? `
        <div class="ds-panel" style="display:flex; align-items:flex-start; gap:12px; background:var(--paper-dim, #efe9d8); border:2px dashed var(--pencil, #55524a); border-radius:var(--r-sketch-md, 8px); padding:12px 16px; margin-bottom:20px;">
          <span style="font-size:24px; line-height:1; user-select:none;">🔒</span>
          <div style="font-family:var(--font-display, cursive); font-size:16px; line-height:1.3; color:var(--pencil, #55524a);">
            <b style="color:var(--ink, #1a30c0); font-size:18px; letter-spacing:0.04em;">GRAPHICS LOCKED DURING ACTIVE GAMEPLAY</b><br>
            To maintain a steady framerate and prevent WebGL shader recompiles during combat, graphics quality and resolution scale can only be adjusted from the Main Menu.
          </div>
        </div>
        ` : ''}
        <div style="margin-bottom: 24px;">
          <h3 style="margin: 0 0 8px 0; font-family: var(--font-display);">Quality Preset</h3>
          <div class="ds-seg" id="setPreset">
            <button class="${settings.graphicsQuality === 'auto' ? 'active' : ''}" data-val="auto" ${isGameActive ? 'disabled' : ''}>AUTO</button>
            <button class="${settings.graphicsQuality === 'low' ? 'active' : ''}" data-val="low" ${isGameActive ? 'disabled' : ''}>PERFORMANCE</button>
            <button class="${settings.graphicsQuality === 'medium' ? 'active' : ''}" data-val="medium" ${isGameActive ? 'disabled' : ''}>BALANCED</button>
            <button class="${settings.graphicsQuality === 'high' ? 'active' : ''}" data-val="high" ${isGameActive ? 'disabled' : ''}>QUALITY</button>
          </div>
        </div>

        <div style="margin-bottom: 24px;">
          <h3 style="margin: 0 0 8px 0; font-family: var(--font-display);">Resolution Scale</h3>
          <div style="display: flex; align-items: center; gap: 16px;">
            <input type="range" class="ds-slider" id="setResScale" min="50" max="150" step="5" value="${settings.resScale}" ${isGameActive ? 'disabled style="opacity:0.5; cursor:not-allowed;"' : ''}>
            <b style="font-family: var(--font-display); font-size: 20px;" id="setResScaleV">${settings.resScale}%</b>
          </div>
          <div style="font-size: 14px; opacity: 0.8; margin-top: 4px;">Render Target: ${currentWidth} × ${currentHeight}</div>
        </div>

        <button class="ds-btn danger" id="resetSettingsBtn" ${isGameActive ? 'disabled' : ''}>RESET TO RECOMMENDED</button>
      </div>

      <!-- 2. CAMERA -->
      <div class="tab-pane ${settingsTab === 'camera' ? 'active' : ''}" id="pane-camera" style="${settingsTab === 'camera' ? 'display:block' : 'display:none'}">
        <div style="margin-bottom: 24px;">
          <h3 style="margin: 0 0 8px 0; font-family: var(--font-display);">Look Sensitivity</h3>
          <div style="display: flex; align-items: center; gap: 16px;">
            <input type="range" class="ds-slider" id="setSens" min="20" max="300" step="5" value="${settings.sens}">
            <b style="font-family: var(--font-display); font-size: 20px;" id="setSensV">${settings.sens}%</b>
          </div>
        </div>
        <div style="margin-bottom: 24px;">
          <h3 style="margin: 0 0 8px 0; font-family: var(--font-display);">Aim Sensitivity</h3>
          <div style="display: flex; align-items: center; gap: 16px;">
            <input type="range" class="ds-slider" id="setAimSens" min="20" max="200" step="5" value="${settings.aimSens}">
            <b style="font-family: var(--font-display); font-size: 20px;" id="setAimSensV">${settings.aimSens}%</b>
          </div>
        </div>
        <div style="margin-bottom: 24px;">
          <div style="display:flex; align-items: center; gap: 12px;">
            <input type="checkbox" class="ds-toggle" id="setInv" ${settings.invert ? 'checked' : ''}>
            <span>Invert Y-Axis</span>
          </div>
        </div>
      </div>

      <!-- 3. LAYOUT / TOUCH -->
      <div class="tab-pane ${settingsTab === 'touch' ? 'active' : ''}" id="pane-touch" style="${settingsTab === 'touch' ? 'display:block' : 'display:none'}">
        <div style="margin-bottom: 24px;">
          <div style="display:flex; align-items: center; gap: 12px;">
            <input type="checkbox" class="ds-toggle" id="setMobile" ${settings.mobile ? 'checked' : ''}>
            <span>Enable Mobile Touch Controls</span>
          </div>
        </div>
        <button class="ds-btn secondary" id="btnCustomize">CUSTOMIZE LAYOUT</button>
      </div>

      <!-- 4. AUDIO -->
      <div class="tab-pane ${settingsTab === 'audio' ? 'active' : ''}" id="pane-audio" style="${settingsTab === 'audio' ? 'display:block' : 'display:none'}">
         <div style="margin-bottom: 24px;">
          <div style="display:flex; align-items: center; gap: 12px;">
            <input type="checkbox" class="ds-toggle" id="setMus" ${musicWanted ? 'checked' : ''}>
            <span>Background Music</span>
          </div>
        </div>
      </div>
    </div>

    <!-- FOOTER -->
    <div style="display: flex; gap: 16px; margin-top: 32px; justify-content: flex-end;">
      <button type="button" class="ds-btn ghost" id="backSettingsBtn">BACK</button>
      <button type="button" class="ds-btn primary" id="saveSettingsBtn">APPLY & CLOSE</button>
    </div>
  </div>`;
}

export function checkpointHTML(ctx) {
  const { LEVELS, mapKey, game, window, arenaFormat, best, bestForMap, bestWaveForMap, musicWanted, renderQuality, isAppInstalled, deferredPrompt, mobile, player, previewWeaponType, previewWeaponInst, cameraFov, lobby, FFA_TARGET, FFA_TIME, net, myName, scores, version, getPlayableMaps, Object } = ctx;

  if (checkpoint < 5) return '';
  let h = '<div class="checkpoints"><span>checkpoints</span>';
  for (let w = 5; w <= checkpoint; w += 5) h += `<button type="button" data-cp="${w}">WAVE ${w}</button>`;
  return h + '</div>';
}

export function weaponsPreviewHTML(ctx) {
  const { LEVELS, mapKey, game, window, arenaFormat, best, bestForMap, bestWaveForMap, musicWanted, renderQuality, isAppInstalled, deferredPrompt, mobile, player, previewWeaponType, previewWeaponInst, cameraFov, lobby, FFA_TARGET, FFA_TIME, net, myName, scores, version, getPlayableMaps, Object } = ctx;


  return `
  <div class="ds-panel" style="width: 100%; max-width: 900px; margin: 40px auto; background: transparent; border: none; box-shadow: none;">
    <h1 style="font-family: var(--font-display); font-size: 48px; margin: 0; color: var(--ink);">WEAPON LOCKER</h1>
    <h2 style="font-family: var(--font-body); font-size: 16px; margin: 4px 0 32px 0; color: var(--ink);">preview your loadout</h2>
    
    <div class="weapons-menu ds-panel" id="weaponsMenu" style="display: flex; flex-direction: column; gap: 24px;">
      <div class="weapons-grid" style="display: flex; gap: 16px; flex-wrap: wrap; justify-content: center;">
        <button type="button" class="ds-btn ${previewWeaponType === 'rifle' ? 'primary' : 'ghost'} lg preview-wep-card" data-wep="rifle">RIFLE</button>
        <button type="button" class="ds-btn ${previewWeaponType === 'shotgun' ? 'primary' : 'ghost'} lg preview-wep-card" data-wep="shotgun">SHOTGUN</button>
        <button type="button" class="ds-btn ${previewWeaponType === 'sniper' ? 'primary' : 'ghost'} lg preview-wep-card" data-wep="sniper">SNIPER</button>
        <button type="button" class="ds-btn ${previewWeaponType === 'katana' ? 'primary' : 'ghost'} lg preview-wep-card" data-wep="katana">KATANA</button>
      </div>
      
      <div style="background: var(--paper); border: 2px solid var(--ink); border-radius: var(--r-sketch-lg); padding: 24px; text-align: center; min-height: 200px;">
         <h3 style="font-family: var(--font-display); font-size: 32px; margin: 0 0 12px 0;">${previewWeaponType.toUpperCase()}</h3>
         <div style="font-family: var(--font-body); font-size: 16px; opacity: 0.8; max-width: 400px; margin: auto;">
            ${previewWeaponType === 'rifle' ? 'Fully automatic assault rifle. Balanced damage and fire rate. Best for mid-range engagements.' :
              previewWeaponType === 'shotgun' ? 'Pump-action scattergun. Devastating at close range. Slow fire rate.' :
              previewWeaponType === 'sniper' ? 'High-powered precision rifle. One shot kill on headshots. Long range.' :
              'Deadly blade for close-quarters combat. Dash-execute enemies when charged.'}
         </div>
      </div>
      
      <div style="display: flex; justify-content: flex-end; margin-top: 16px;">
        <button type="button" class="ds-btn ghost md" id="backWeaponsBtn">BACK</button>
      </div>
    </div>
  </div>`;

}

export function mapSelectHTML(ctx) {
  const { LEVELS, mapKey, game, window, arenaFormat, best, bestForMap, bestWaveForMap, musicWanted, renderQuality, isAppInstalled, deferredPrompt, mobile, player, previewWeaponType, previewWeaponInst, cameraFov, lobby, FFA_TARGET, FFA_TIME, net, myName, scores, version, getPlayableMaps, Object } = ctx;


  const curMap = LEVELS.find((m) => m.key === mapKey) || LEVELS[0];
  
  let cardsHTML = '';
  LEVELS.forEach(m => {
    const tagsHTML = (m.tags || []).map(t => `<div style="font-size: 10px; border: 1px solid var(--pencil); border-radius: 4px; padding: 2px 6px; color: var(--pencil);">${t}</div>`).join('');
    
    const active = m.key === mapKey ? 'var(--ink-wash)' : 'transparent';
    const border = m.key === mapKey ? 'var(--ink)' : 'var(--pencil)';
    const soon = m.comingSoon ? 'opacity: 0.6;' : '';
    const clickAttr = m.comingSoon ? '' : `data-map="${m.key}"`;
    const disabled = m.comingSoon ? 'disabled' : '';

    cardsHTML += `
      <div class="ds-panel mapbtn" ${clickAttr} ${disabled} style="background: ${active}; border-color: ${border}; ${soon} padding: 12px; cursor: pointer; display: flex; flex-direction: column; gap: 8px; flex: 0 0 240px; box-sizing: border-box; transition: transform 0.1s;">
        <div style="display: flex; justify-content: space-between; font-size: 10px; font-weight: bold; color: var(--pencil);">
          <span>${m.category === 'urban' ? 'SEC-01' : m.category === 'colossal' ? 'SEC-02' : 'SEC-03'}</span>
          <span>${m.env || ''}</span>
        </div>
        <div style="height: 120px; display: flex; align-items: center; justify-content: center; ${m.comingSoon ? 'font-size: 16px; font-weight: bold; letter-spacing: 2px; text-align: center;' : ''}">
          ${m.comingSoon ? 'COMING<br>SOON' : getMapSVG(m.key)}
        </div>
        <div style="font-family: var(--font-display); font-size: 24px; text-align: center; color: var(--ink);">${m.name}</div>
        <div style="display: flex; gap: 4px; flex-wrap: wrap; justify-content: center; margin-top: auto;">${tagsHTML}</div>
      </div>
    `;
  });

  const bestScore = Number(localStorage.getItem(`doodle_best_${mapKey}`)) || 0;
  const isLocked = !!curMap.comingSoon;
  const deployDisabled = isLocked ? 'disabled' : '';
  
  const diffStyle = (d) => {
    if (window.currentDifficulty === d) return d === 4 ? 'background:var(--ink-red); color:var(--paper); border-color:var(--ink-red);' : 'background:var(--ink); color:var(--paper);';
    return d === 4 ? 'color:var(--ink-red); border-color:var(--ink-red);' : 'color:var(--ink); background:transparent;';
  };
  const diffBtn = (d, label) => `<button class="tactical-filter-btn ds-btn secondary sm" data-diff="${d}" style="${diffStyle(d)}">${label}</button>`;

  const formatStyle = (f) => {
    if (arenaFormat === f) return 'background:var(--ink-blue, #1a30c0); color:var(--paper); border-color:var(--ink-blue, #1a30c0); font-weight:bold;';
    return 'color:var(--ink); border-color:var(--pencil); background:transparent;';
  };
  const formatBtn = (f, label) => `<button class="tactical-format-btn ds-btn secondary sm" data-format="${f}" style="${formatStyle(f)}">${label}</button>`;

  const isArenaMode = game.mode === 'arena' || game.mode === 'duel';
  const deployLabel = isLocked ? 'MISSION IN DEVELOPMENT' : (isArenaMode ? `DEPLOY TO ${arenaFormat.toUpperCase()} ARENA` : 'DEPLOY TO MISSION');

  return `
  <div id="mapsel" style="width: 100%; max-width: 1200px; margin: 0 auto; display: flex; flex-direction: column; justify-content: center; gap: 24px; pointer-events: auto; height: 100%;">
    
    ${isArenaMode ? `
    <div style="background: var(--ink-wash); border-radius: var(--r-sketch-md); padding: 12px 24px; display: flex; flex-direction: column; gap: 10px; align-items: center;">
      <div style="display: flex; gap: 14px; align-items: center; flex-wrap: wrap; justify-content: center;">
        <div style="font-size: 13px; opacity: 0.85; font-weight: bold; font-family: var(--font-display); letter-spacing: 2px;">ARENA FORMAT</div>
        <div style="display: flex; gap: 6px; flex-wrap: wrap;">
          ${formatBtn('1v1', '1v1 DUEL')}
          ${formatBtn('2v2', '2v2 SQUAD')}
          ${formatBtn('3v3', '3v3 SQUAD')}
          ${formatBtn('4v4', '4v4 SQUAD')}
          ${formatBtn('5v5', '5v5 TEAM')}
          ${formatBtn('ffa', 'FREE FOR ALL')}
        </div>
      </div>
      <div style="display: flex; gap: 14px; align-items: center; flex-wrap: wrap; justify-content: center;">
        <div style="font-size: 13px; opacity: 0.85; font-weight: bold; font-family: var(--font-display); letter-spacing: 2px;">AI DIFFICULTY</div>
        <div style="display: flex; gap: 6px; flex-wrap: wrap;">
          ${diffBtn(0, 'STUPID')}${diffBtn(1, 'EASY')}${diffBtn(2, 'HARD')}${diffBtn(3, 'EXTREME')}${diffBtn(4, 'GOD MODE')}
        </div>
      </div>
    </div>
    ` : (game.mode === 'solo' ? `
    <div style="background: var(--ink-wash); border-radius: var(--r-sketch-md); padding: 12px 24px; display: flex; justify-content: center; gap: 24px; align-items: center;">
      <div style="font-size: 14px; opacity: 0.8; font-weight: bold; font-family: var(--font-display); letter-spacing: 2px;">AI DIFFICULTY</div>
      <div style="display: flex; gap: 8px; flex-wrap: wrap;">
        ${diffBtn(0, 'STUPID')}${diffBtn(1, 'EASY')}${diffBtn(2, 'HARD')}${diffBtn(3, 'EXTREME')}${diffBtn(4, 'GOD MODE')}
      </div>
    </div>
    ` : '')}

    <div style="display: flex; gap: 24px; align-items: stretch; flex-grow: 1; min-height: 0;">
      
      <!-- CAROUSEL AREA (Left Side) -->
      <div class="map-carousel" style="flex-grow: 1; display: flex; align-items: stretch; gap: 16px; overflow-x: auto; padding-bottom: 12px; scrollbar-width: thin; scrollbar-color: var(--ink) transparent;">
        ${cardsHTML}
      </div>
      
      <!-- DOSSIER AREA (Right Side) -->
      <div class="ds-panel" style="width: 320px; flex-shrink: 0; display: flex; flex-direction: column; gap: 16px; overflow-y: auto;">
        <div style="font-family: var(--font-display); font-size: 28px; color: var(--ink); border-bottom: 2px dashed var(--ink-wash); padding-bottom: 8px;">${curMap.name}</div>
        <div style="min-height: 140px; display: flex; align-items: center; justify-content: center;">
           ${getMapSVG(curMap.key, true)}
        </div>
        <div style="display: flex; flex-direction: column; gap: 8px; font-family: var(--font-mono); font-size: 14px;">
          <div style="display: flex; justify-content: space-between;"><span>ENV</span> <b>${curMap.env || 'Unknown'}</b></div>
          <div style="display: flex; justify-content: space-between;"><span>ENGAGE</span> <b>${curMap.engagement || 'Unknown'}</b></div>
          <div style="display: flex; justify-content: space-between;"><span>SCALE</span> <b>${curMap.scale || 'Unknown'}</b></div>
        </div>
        ${curMap.hazard && curMap.hazard !== 'None' ? `<div style="color: var(--ink-red); font-family: var(--font-mono); font-size: 12px; font-weight: bold; text-align: center; margin-top: 8px;">WARNING: ${curMap.hazard}</div>` : ''}
        ${bestScore > 0 ? `<div style="font-family: var(--font-display); font-size: 16px; text-align: center; border-top: 2px dashed var(--ink-wash); padding-top: 12px; margin-top: 8px;">BEST SCORE: ${bestScore}</div>` : ''}
        ${checkpointHTML()}
      </div>
    </div>

    <!-- BOTTOM BAR -->
    <div style="display: flex; justify-content: space-between; align-items: center; border-top: 2px solid var(--ink); padding: 16px 20px; background: rgba(246,243,230,0.85); backdrop-filter: blur(8px); border-radius: var(--r-sketch-md); flex-shrink: 0;">
      <button class="ds-btn ghost md" id="backBtn">ESC / BACK</button>
      <div style="display: flex; gap: 16px;">
        <button class="ds-btn secondary md" id="weaponsBtn">WEAPONS</button>
        <button class="ds-btn ${isLocked ? 'ghost' : 'primary'} lg" id="startBtn" ${deployDisabled}>${deployLabel}</button>
      </div>
    </div>
  </div>
  `;

}

export function mainHTML(ctx) {
  const { LEVELS, mapKey, game, window, arenaFormat, best, bestForMap, bestWaveForMap, musicWanted, renderQuality, isAppInstalled, deferredPrompt, mobile, player, previewWeaponType, previewWeaponInst, cameraFov, lobby, FFA_TARGET, FFA_TIME, net, myName, scores, version, getPlayableMaps, Object } = ctx;


  const isInstalled = isAppInstalled();
  const installDisplay = (!isInstalled && typeof deferredPrompt !== 'undefined' && deferredPrompt) ? 'flex' : 'none';
  
  return `
  <div class="floating-utilities">
    <button type="button" id="forceReloadBtn" class="floating-btn update-btn" title="Update App">
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 2v6h-6"></path>
        <path d="M3 12a9 9 0 1 0 2.13-5.88L2 9"></path>
      </svg>
    </button>
    <button type="button" id="settingsBtn" class="floating-btn settings-btn" title="Settings">
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>
      </svg>
    </button>
  </div>
  <div style="width: 100%; max-width: 800px; margin: 0 auto; padding: 24px 0; display: flex; flex-direction: column; align-items: center;">
    <h1 style="font-family: var(--font-display); font-size: clamp(40px, 8vw, 64px); letter-spacing: 3px; line-height: 1; margin: 0; color: var(--ink); text-align: center;">DOODLE STRIKE</h1>
    <h2 style="font-family: var(--font-body); font-size: 20px; font-weight: normal; margin: 4px 0 48px 0; color: var(--ink); text-align: center;">TACTICAL INK SHOOTER</h2>
    
    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px; width: 100%;">
      <button type="button" id="soloBtn" class="ds-btn primary hero" style="transform: rotate(var(--tilt-a)); padding: 24px; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 120px;">
        <span style="font-size: 32px; letter-spacing: 2px;">SURVIVAL</span>
        <span style="font-size: 14px; font-family: var(--font-mono); opacity: 0.9; margin-top: 8px;">Wave Defense</span>
      </button>
      <button type="button" id="duelBtn" class="ds-btn secondary hero" style="transform: rotate(var(--tilt-b)); padding: 24px; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 120px;">
        <span style="font-size: 32px; letter-spacing: 2px;">BOT ARENA</span>
        <span style="font-size: 14px; font-family: var(--font-mono); opacity: 0.9; margin-top: 8px;">1v1 to 5v5 &amp; FFA</span>
      </button>
      <button type="button" id="onlineBtn" class="ds-btn secondary hero" style="transform: rotate(var(--tilt-c)); padding: 24px; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 120px;">
        <span style="font-size: 32px; letter-spacing: 2px;">MULTIPLAYER</span>
        <span style="font-size: 14px; font-family: var(--font-mono); opacity: 0.9; margin-top: 8px;">Public / Private</span>
      </button>
      <button type="button" id="exploreBtn" class="ds-btn secondary hero" style="transform: rotate(var(--tilt-a)); padding: 24px; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 120px;">
        <span style="font-size: 32px; letter-spacing: 2px;">FREE ROAM</span>
        <span style="font-size: 14px; font-family: var(--font-mono); opacity: 0.9; margin-top: 8px;">Zero Enemies</span>
      </button>
    </div>
  </div>
  ${!isInstalled ? `<button type="button" id="mainInstallBtn" class="ds-btn ghost md" style="position: absolute; top: 24px; left: 24px; display: ${installDisplay};">INSTALL APP</button>` : ''}
  `;

}

export function onlineHTML(ctx) {
  const { LEVELS, mapKey, game, window, arenaFormat, best, bestForMap, bestWaveForMap, musicWanted, renderQuality, isAppInstalled, deferredPrompt, mobile, player, previewWeaponType, previewWeaponInst, cameraFov, lobby, FFA_TARGET, FFA_TIME, net, myName, scores, version, getPlayableMaps, Object } = ctx;


  return `
  <div style="width: 100%; max-width: 800px; margin: 0 auto; padding: 24px 0;">
    <h1 style="font-family: var(--font-display); font-size: 48px; margin: 0; color: var(--ink);">PLAY ONLINE</h1>
    <h2 style="font-family: var(--font-body); font-size: 16px; margin: 4px 0 32px 0; color: var(--ink);">free for all &bull; first to ${FFA_TARGET} &bull; up to 10 players</h2>
    
    <div class="online ds-panel" id="online" style="display: flex; flex-direction: column; gap: 24px;">
      
      <div style="display: flex; align-items: center; gap: 16px;">
        <span style="font-family: var(--font-display); font-size: 20px;">YOUR NAME</span>
        <input type="text" class="namebox ds-input" id="setName" maxlength="14" value="${esc(myName)}" style="flex-grow: 1; max-width: 200px; font-size: 20px;">
      </div>
      
      <div style="display: flex; align-items: center; gap: 16px; flex-wrap: wrap;">
        <button type="button" class="ds-btn primary lg" id="quickBtn">QUICK PLAY</button>
        <span style="opacity: 0.8; font-size: 14px;">jumps into an open public lobby, or opens one for you</span>
      </div>
      
      <div style="border-top: 2px dashed var(--ink-wash); margin: 8px 0; text-align: center;">
        <span style="background: var(--paper); padding: 0 16px; position: relative; top: -12px; font-family: var(--font-display);">OR</span>
      </div>
      
      <div style="display: flex; align-items: center; gap: 16px; flex-wrap: wrap;">
        <button type="button" class="ds-btn secondary md" id="createBtn">CREATE LOBBY</button>
        <div class="radio ds-seg" style="display: flex;">
          <label class="ds-btn ${lobby.isPublic ? 'active' : 'ghost'}"><input type="radio" name="vis" value="public" ${lobby.isPublic ? 'checked' : ''} style="display:none;"> PUBLIC</label>
          <label class="ds-btn ${lobby.isPublic ? 'ghost' : 'active'}"><input type="radio" name="vis" value="private" ${lobby.isPublic ? '' : 'checked'} style="display:none;"> PRIVATE (code)</label>
        </div>
      </div>
      
      <div style="display: flex; align-items: center; gap: 16px;">
        <span style="font-family: var(--font-display); font-size: 20px;">HAVE A CODE?</span>
        <input type="text" id="codeBox" class="ds-input" placeholder="CODE" maxlength="5" autocomplete="off" style="width: 100px; font-size: 20px; text-transform: uppercase;">
        <button type="button" class="ds-btn secondary md" id="joinBtn">JOIN</button>
      </div>
      
      <div class="lobbylist" id="lobbylist" style="margin-top: 16px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
          <span style="font-family: var(--font-display); font-size: 20px;">PUBLIC LOBBIES</span>
          <button type="button" class="ds-btn ghost sm" id="refreshBtn">REFRESH</button>
        </div>
        <div class="rows" id="lobbyRows" style="background: var(--ink-wash); border-radius: var(--r-sketch-md); padding: 12px; min-height: 100px;">
          ${lobbyListHTML()}
        </div>
      </div>
      
      <div class="status" id="status" style="font-family: var(--font-mono); color: var(--ink-red);">${esc(lobby.status || '')}</div>
      
      ${lobby.rejoinCode ? `<div class="row" style="display: flex; justify-content: center; margin-bottom: 16px;"><button type="button" class="ds-btn danger lg" id="rejoinBtn">REJOIN ${esc(lobby.rejoinCode)}</button></div>` : ''}
      
      <!-- BOTTOM BAR -->
      <div style="display: flex; justify-content: space-between; align-items: center; border-top: 2px solid var(--ink); margin-top: 16px; padding: 16px 20px; background: rgba(246,243,230,0.85); backdrop-filter: blur(8px); border-radius: var(--r-sketch-md); flex-shrink: 0;">
        <button type="button" class="ds-btn ghost md" id="backBtn">ESC / BACK</button>
      </div>
    </div>
  </div>`;

}

export function lobbyHTML(ctx) {
  const { LEVELS, mapKey, game, window, arenaFormat, best, bestForMap, bestWaveForMap, musicWanted, renderQuality, isAppInstalled, deferredPrompt, mobile, player, previewWeaponType, previewWeaponInst, cameraFov, lobby, FFA_TARGET, FFA_TIME, net, myName, scores, version, getPlayableMaps, Object } = ctx;


  const rows = lobbyRows(); const host = net.isHost; const n = rows.length;
  return `
  <div style="width: 100%; max-width: 800px; margin: 0 auto; padding: 24px 0;">
    <h1 style="font-family: var(--font-display); font-size: 48px; margin: 0; color: var(--ink);">LOBBY</h1>
    <h2 style="font-family: var(--font-body); font-size: 16px; margin: 4px 0 32px 0; color: var(--ink);">free for all &bull; first to ${FFA_TARGET} &bull; ${n}/${net.maxPlayers} players</h2>
    
    <div class="online ds-panel" id="online" style="display: flex; flex-direction: column; gap: 24px;">
      
      <div style="display: flex; align-items: center; justify-content: space-between;">
        <div>
            <span style="font-family: var(--font-display); font-size: 20px;">CODE</span>
            <span class="code" style="font-family: var(--font-mono); font-size: 24px; font-weight: bold; margin-left: 12px;">${String(net.isHost ? (net.aliasCode || net.code) : (lobby.shown || net.code) || '').replace(/-\d+$/, '')}</span>
        </div>
        <div class="hint" style="font-size: 14px; opacity: 0.8; max-width: 250px; text-align: right;">
            ${lobby.isPublic ? 'this lobby is public: anyone can quick play in, or type the code' : 'private lobby: friends type this code under PLAY ONLINE -> JOIN'}
        </div>
      </div>
      
      <div style="border-top: 2px dashed var(--ink-wash); margin: 8px 0;"></div>
      
      ${mapHTML(lobby.map || mapKey, host)}
      
      <div class="plist" style="background: var(--ink-wash); border-radius: var(--r-sketch-md); padding: 16px; display: flex; flex-direction: column; gap: 8px;">
        <div style="font-family: var(--font-display); font-size: 16px; opacity: 0.8; color: var(--ink);">PLAYERS</div>
        ${rows.map((p) => `<div class="${p.id === lobby.hostId ? 'host' : ''}${p.id === net.id ? ' me' : ''}" style="display:flex; justify-content:space-between; font-family: var(--font-mono); color: var(--ink);">
            <span>${esc(p.name)}</span>
            <span style="opacity:0.6;">${p.id === net.id ? 'YOU' : ''}</span>
        </div>`).join('')}
      </div>
      
      <div class="status" id="status" style="font-family: var(--font-mono); color: var(--ink-red);">${esc(lobby.status || '')}</div>
      <div class="hint" style="text-align: center; opacity: 0.8; font-size: 14px;">anyone can start &bull; ${n < 2 ? 'people can still join once it is running' : n + ' players in'}</div>
      
      <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 16px; flex-wrap: wrap; gap: 12px;">
        <button type="button" class="ds-btn danger md" id="leaveBtn">LEAVE</button>
        <div style="display: flex; gap: 12px;">
            <button type="button" class="ds-btn secondary md" id="weaponsBtn">VIEW WEAPONS</button>
            <button type="button" class="ds-btn primary lg" id="startBtn">START MATCH</button>
        </div>
      </div>
    </div>
  </div>`;

}

export function lobbyListHTML(ctx) {
  const { LEVELS, mapKey, game, window, arenaFormat, best, bestForMap, bestWaveForMap, musicWanted, renderQuality, isAppInstalled, deferredPrompt, mobile, player, previewWeaponType, previewWeaponInst, cameraFov, lobby, FFA_TARGET, FFA_TIME, net, myName, scores, version, getPlayableMaps, Object } = ctx;


  if (listBusy) return '<div style="opacity:0.8;">looking…</div>';
  if (!lobbyList) return '<div style="opacity:0.8;">press refresh to look for open lobbies</div>';
  if (!lobbyList.length) return '<div style="opacity:0.8;">hit QUICK PLAY to join a lobby</div>';
  return lobbyList.map((l) => `
    <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px dashed var(--ink-wash);">
      <div>
        <b style="font-family: var(--font-mono); font-size: 16px;">${esc(l.code)}</b>
        <span style="margin-left: 12px; opacity: 0.9;">${esc(l.hostName || 'someone')}'s lobby</span>
        <span style="margin-left: 12px; font-size: 14px; opacity: 0.7;">${l.players}/${l.max}${l.inMatch ? ' &bull; in match' : ''}</span>
      </div>
      ${l.full ? '<span style="opacity:0.5;">FULL</span>' : `<button type="button" class="ds-btn secondary sm" data-join="${esc(l.code)}">JOIN</button>`}
    </div>`).join('');

}

export function menuBtnHTML(ctx) {
  const { LEVELS, mapKey, game, window, arenaFormat, best, bestForMap, bestWaveForMap, musicWanted, renderQuality, isAppInstalled, deferredPrompt, mobile, player, previewWeaponType, previewWeaponInst, cameraFov, lobby, FFA_TARGET, FFA_TIME, net, myName, scores, version, getPlayableMaps, Object } = ctx;
 return '<div class="online menubtn"><div class="row"><button type="button" class="alt" id="menuBtn">MAIN MENU</button></div></div>'; }

