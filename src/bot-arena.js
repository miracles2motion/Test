// src/bot-arena.js
// Master Coordinator for Solo Arena Bot Battles (1v1 to 5v5 & Free For All).
// Manages match formats, team scoring, respawns, killfeed, and overhyped bot hype engine.

import * as THREE from 'three';
import { BotPlayer } from './bot-player.js';
import { INK } from './render.js';
import { choose, rand } from './util.js';

const BOT_NAMES_ALPHA = [
  'Ghost', 'Razor', 'Sentinel', 'Vanguard', 'Apex', 'Phantom', 'Cipher'
];

const BOT_NAMES_BRAVO = [
  'xX_InkSniper_Xx', 'Apex_Biro', 'DreadPixel', 'Overlord', 'VoidWalker', 'Havoc', 'SkullCrusher'
];

const BOT_NAMES_FFA = [
  'Chaos_Doodle', 'Grim_Reaper', 'Neon_Blade', 'Pixel_Demon', 'Blitzer', 'CyberPen', 'Vortex'
];

export class BotArenaManager {
  constructor(ctx) {
    this.ctx = ctx;
    this.active = false;
    this.format = '5v5'; // '1v1' | '2v2' | '3v3' | '4v4' | '5v5' | 'ffa'
    this.difficulty = 4; // 0..4 (4 = Overhyped God Mode)
    this.bots = [];
    this.scoreAlpha = 0;
    this.scoreBravo = 0;
    this.targetScore = 25;
    this.matchTime = 180.0;
    this.timeLeft = 180.0;
    this.over = false;
    this.winner = null;

    this.killfeed = [];
    this.respawnQueue = [];
    this.stats = new Map(); // id -> { name, team, kills, deaths, streak }
    this.banterPopup = null;
    this.banterTimer = 0;
  }

  startMatch(format = '5v5', difficulty = 4) {
    this.active = true;
    this.format = format;
    this.difficulty = difficulty;
    this.over = false;
    this.winner = null;
    this.scoreAlpha = 0;
    this.scoreBravo = 0;
    this.killfeed = [];
    this.respawnQueue = [];
    this.stats.clear();

    // Clean up any existing bots
    for (const b of this.bots) {
      if (b.root && b.root.parent) {
        b.ctx.scene.remove(b.root);
      }
    }
    this.bots = [];

    // Set match targets & timers based on format
    if (format === '1v1') {
      this.targetScore = 10;
      this.matchTime = 180;
    } else if (format === '2v2') {
      this.targetScore = 15;
      this.matchTime = 240;
    } else if (format === '3v3') {
      this.targetScore = 20;
      this.matchTime = 240;
    } else if (format === '4v4') {
      this.targetScore = 25;
      this.matchTime = 300;
    } else if (format === '5v5') {
      this.targetScore = 30;
      this.matchTime = 300;
    } else {
      // FFA
      this.targetScore = 20;
      this.matchTime = 240;
    }
    this.timeLeft = this.matchTime;

    const player = this.ctx.player;
    player.team = format === 'ffa' ? 'player' : 'alpha';
    player.isLocal = true;

    this.stats.set(player.id || 'player', {
      name: player.name || 'YOU',
      team: player.team,
      kills: 0,
      deaths: 0,
      streak: 0
    });

    // Populate Teams according to format
    this._spawnMatchEntities();

    // Push initial hype message
    const diffLabel = difficulty === 4 ? 'GOD MODE' : (difficulty === 3 ? 'EXTREME' : 'STANDARD');
    this.ctx.hud?.message(
      format.toUpperCase() + ' ARENA',
      `AI DIFFICULTY: ${diffLabel} · TARGET: ${this.targetScore} KILLS`,
      3.5
    );
  }

  _spawnMatchEntities() {
    const level = this.ctx.level;
    const teamSpawns = level?.teamSpawns;
    const defaultSpawns = level?.spawns || [new THREE.Vector3(0, 1, 40), new THREE.Vector3(0, 1, -40)];

    const alphaSpawns = (teamSpawns && teamSpawns[0]) ? teamSpawns[0] : defaultSpawns;
    const bravoSpawns = (teamSpawns && teamSpawns[1]) ? teamSpawns[1] : defaultSpawns;

    // Spawn player at primary Alpha spawn
    if (this.format !== 'ffa' && alphaSpawns.length > 0) {
      const pSpawn = alphaSpawns[0];
      this.ctx.player.teleport(pSpawn.x, pSpawn.y + 0.5, pSpawn.z);
    }

    if (this.format === '1v1') {
      // 1 Enemy Bot on Team Bravo
      const spawnPt = bravoSpawns[0] || new THREE.Vector3(0, 1, -38);
      this._createBot('bot_bravo_1', `[BOT] ${BOT_NAMES_BRAVO[0]}`, 'bravo', INK.RED ?? 1, spawnPt);

    } else if (this.format === 'ffa') {
      // 5 FFA Bots
      for (let i = 0; i < 5; i++) {
        const name = `[BOT] ${BOT_NAMES_FFA[i % BOT_NAMES_FFA.length]}`;
        const sIdx = i % defaultSpawns.length;
        const pt = defaultSpawns[sIdx] || new THREE.Vector3(rand(-30, 30), 1, rand(-30, 30));
        const inkColor = (i % 2 === 0) ? (INK.RED ?? 1) : (INK.ORANGE ?? 3);
        this._createBot(`bot_ffa_${i}`, name, `ffa_${i}`, inkColor, pt);
      }

    } else {
      // Team Match (2v2, 3v3, 4v4, 5v5)
      const teamSize = parseInt(this.format[0], 10) || 5;
      const friendlyCount = teamSize - 1; // Player is 1 member of Alpha
      const enemyCount = teamSize;

      // 1. Friendly Bots (Team Alpha)
      for (let i = 0; i < friendlyCount; i++) {
        const name = `Alpha ${i + 2}: [BOT] ${BOT_NAMES_ALPHA[i % BOT_NAMES_ALPHA.length]}`;
        const sPt = alphaSpawns[(i + 1) % alphaSpawns.length] || new THREE.Vector3(-12 + i * 8, 1, 38);
        this._createBot(`bot_alpha_${i}`, name, 'alpha', INK.BLUE ?? 0, sPt);
      }

      // 2. Enemy Bots (Team Bravo)
      for (let i = 0; i < enemyCount; i++) {
        const name = `Bravo ${i + 1}: [BOT] ${BOT_NAMES_BRAVO[i % BOT_NAMES_BRAVO.length]}`;
        const sPt = bravoSpawns[i % bravoSpawns.length] || new THREE.Vector3(-16 + i * 8, 1, -38);
        this._createBot(`bot_bravo_${i}`, name, 'bravo', INK.RED ?? 1, sPt);
      }
    }
  }

  _createBot(id, name, team, ink, spawnPt) {
    const bot = new BotPlayer(this.ctx, id, name, team, ink, this.difficulty);
    bot.spawn(spawnPt);

    bot.onDeath = (victim, fromPos) => this.handleDeath(victim, fromPos);
    bot.onBanter = (speaker, line, cat) => this.handleBanter(speaker, line, cat);

    this.bots.push(bot);
    this.stats.set(id, { name, team, kills: 0, deaths: 0, streak: 0 });
    return bot;
  }

  update(dt) {
    if (!this.active || this.over) return;

    this.timeLeft -= dt;

    // Check match time expiration
    if (this.timeLeft <= 0) {
      this.timeLeft = 0;
      this._evaluateTimeExpiration();
      return;
    }

    // Process respawn queue
    for (let i = this.respawnQueue.length - 1; i >= 0; i--) {
      const item = this.respawnQueue[i];
      item.timer -= dt;
      if (item.timer <= 0) {
        this._respawnEntity(item.entity);
        this.respawnQueue.splice(i, 1);
      }
    }

    // Active targets for bots (alive player + alive bots)
    const matchTargets = [];
    if (this.ctx.player?.alive) {
      matchTargets.push(this.ctx.player);
    }
    for (const b of this.bots) {
      if (b.alive) matchTargets.push(b);
    }

    // Update all bots
    for (const b of this.bots) {
      b.update(dt, matchTargets);
    }

    // Update killfeed fadeout
    for (let i = this.killfeed.length - 1; i >= 0; i--) {
      this.killfeed[i].life -= dt;
      if (this.killfeed[i].life <= 0) {
        this.killfeed.splice(i, 1);
      }
    }

    // Update banter popup timer
    if (this.banterTimer > 0) {
      this.banterTimer -= dt;
      if (this.banterTimer <= 0) this.banterPopup = null;
    }
  }

  handlePlayerKill(victim) {
    const player = this.ctx.player;
    this.handleDeath(victim, player.eye, player);
  }

  handleDeath(victim, fromPos, explicitKiller = null) {
    const killer = explicitKiller || victim.target || null;
    const killerId = killer ? (killer.id || 'player') : 'unknown';
    const killerName = killer ? (killer.name || 'YOU') : 'HAZARD';
    const victimName = victim.name || (victim === this.ctx.player ? 'YOU' : 'SOLDIER');

    // Update statistics
    const victimStats = this.stats.get(victim.id || 'player');
    if (victimStats) {
      victimStats.deaths++;
      victimStats.streak = 0;
    }

    let killerTeam = killer?.team;
    if (killerStats) {
      killerStats.kills++;
      killerStats.streak++;
    }

    // Award Team Score
    if (this.format === 'ffa') {
      if (killerStats) {
        if (killerStats.kills >= this.targetScore) {
          this.endMatch(killerName);
          return;
        }
      }
    } else {
      if (victim.team === 'bravo') {
        this.scoreAlpha++;
        if (this.scoreAlpha >= this.targetScore) {
          this.endMatch('TEAM ALPHA');
          return;
        }
      } else if (victim.team === 'alpha') {
        this.scoreBravo++;
        if (this.scoreBravo >= this.targetScore) {
          this.endMatch('TEAM BRAVO');
          return;
        }
      }
    }

    // Add Killfeed entry
    const isHeadshot = Math.random() < 0.35;
    const icon = isHeadshot ? '🎯' : '🔫';
    const killText = `${killerName} ${icon} ${victimName}`;
    this.killfeed.unshift({
      id: Math.random(),
      text: killText,
      killerTeam: killer?.team,
      victimTeam: victim?.team,
      life: 4.5
    });
    if (this.killfeed.length > 5) this.killfeed.pop();

    // Killstreak Callout
    const killerStats = this.stats.get(killerId);
    if (killerStats && killerStats.streak >= 3) {
      const streakTitle = killerStats.streak === 3 ? 'TRIPLE KILL!' : (killerStats.streak === 4 ? 'ULTRA KILL!' : 'GOD-LIKE STREAK!');
      this.ctx.hud?.tip(`${killerName} — ${streakTitle}`, 2.2);
    }

    // Queue victim for respawn after 3.0s
    this.respawnQueue.push({
      entity: victim,
      timer: 3.0
    });
  }

  handleBanter(speaker, line, category) {
    this.banterPopup = {
      speaker: speaker.name,
      team: speaker.team,
      line: `"${line}"`
    };
    this.banterTimer = 3.0;
  }

  _respawnEntity(entity) {
    if (!this.active || this.over) return;

    const level = this.ctx.level;
    const teamSpawns = level?.teamSpawns;
    const defaultSpawns = level?.spawns || [new THREE.Vector3(0, 1, 40), new THREE.Vector3(0, 1, -40)];

    let spawnPool = defaultSpawns;
    if (this.format !== 'ffa' && teamSpawns) {
      spawnPool = entity.team === 'alpha' ? teamSpawns[0] : teamSpawns[1];
    }

    // Select random spawn point from pool
    const spawnPt = choose(spawnPool) || new THREE.Vector3(0, 1, 0);
    const jitterX = (Math.random() - 0.5) * 4.0;
    const jitterZ = (Math.random() - 0.5) * 4.0;
    const targetPos = new THREE.Vector3(spawnPt.x + jitterX, (spawnPt.y || 0) + 0.8, spawnPt.z + jitterZ);

    if (entity === this.ctx.player) {
      this.ctx.player.teleport(targetPos.x, targetPos.y, targetPos.z);
      this.ctx.player.hp = this.ctx.player.maxHp || 100;
      this.ctx.player.alive = true;
      this.ctx.hud?.tip('RESPAWNED - GET REVENGE!', 2.0);
    } else if (typeof entity.spawn === 'function') {
      entity.spawn(targetPos);
    }
  }

  _evaluateTimeExpiration() {
    if (this.format === 'ffa') {
      let topKiller = 'DRAW';
      let topKills = -1;
      for (const [id, s] of this.stats) {
        if (s.kills > topKills) {
          topKills = s.kills;
          topKiller = s.name;
        }
      }
      this.endMatch(topKiller);
    } else {
      if (this.scoreAlpha > this.scoreBravo) {
        this.endMatch('TEAM ALPHA');
      } else if (this.scoreBravo > this.scoreAlpha) {
        this.endMatch('TEAM BRAVO');
      } else {
        this.endMatch('DRAW');
      }
    }
  }

  endMatch(winner) {
    this.over = true;
    this.winner = winner;

    const isPlayerWin = (winner === 'TEAM ALPHA') || (winner === (this.ctx.player.name || 'YOU'));
    const banner = isPlayerWin ? 'VICTORY!' : (winner === 'DRAW' ? 'DRAW!' : 'DEFEAT!');
    const sub = `WINNER: ${winner} | ALPHA: ${this.scoreAlpha} - ${this.scoreBravo} BRAVO`;

    this.ctx.hud?.message(banner, sub, 8.0);
    if (typeof this.onMatchEnd === 'function') {
      this.onMatchEnd({
        winner,
        scoreAlpha: this.scoreAlpha,
        scoreBravo: this.scoreBravo,
        stats: Array.from(this.stats.values())
      });
    }
  }
}
