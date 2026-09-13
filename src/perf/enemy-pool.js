// ============================================================================
// DREAM PHASE 7 - ENEMY OBJECT POOL & SHELL MANAGER (SYSTEM 6)
// Pre-warmed enemy shells, zero-allocation awakening, and concurrency capping
// ============================================================================

export class EnemyShell {
  constructor(id) {
    this.id = id;
    this.mesh = null;
    this.state = 'DORMANT'; // DORMANT, PRE_WARMED, ACTIVE, DYING
    this.archetype = null;
    this.stats = {
      hp: 100,
      maxHp: 100,
      speed: 4.0,
      damage: 15,
    };
    this.pos = [0, 0, 0];
    this.rotY = 0;
    this.activeTime = 0;
  }

  reset() {
    this.state = 'DORMANT';
    this.archetype = null;
    if (this.mesh) this.mesh.visible = false;
    this.activeTime = 0;
  }

  awaken(archetype, pos, rotY = 0, statMultipliers = {}) {
    this.archetype = archetype;
    this.pos[0] = pos[0];
    this.pos[1] = pos[1];
    this.pos[2] = pos[2];
    this.rotY = rotY;

    this.stats.maxHp = 100 * (statMultipliers.hp || 1.0);
    this.stats.hp = this.stats.maxHp;
    this.stats.speed = 4.0 * (statMultipliers.speed || 1.0);
    this.stats.damage = 15 * (statMultipliers.damage || 1.0);

    this.state = 'ACTIVE';
    if (this.mesh) {
      this.mesh.position.set(pos[0], pos[1], pos[2]);
      this.mesh.rotation.y = rotY;
      this.mesh.visible = true;
    }
  }
}

export class EnemyPoolManager {
  constructor(concurrencyBudget = 16) {
    this.concurrencyBudget = concurrencyBudget;
    this.shells = [];
    this.activeCount = 0;
    this.pendingQueue = [];

    // Pre-allocate shells
    const maxCapacity = Math.max(20, concurrencyBudget + 8);
    for (let i = 0; i < maxCapacity; i++) {
      this.shells.push(new EnemyShell(i));
    }
  }

  setBudget(budget) {
    this.concurrencyBudget = budget;
  }

  getDormantShell() {
    for (let i = 0; i < this.shells.length; i++) {
      if (this.shells[i].state === 'DORMANT') {
        return this.shells[i];
      }
    }
    return null;
  }

  spawn(archetype, pos, rotY = 0, statMultipliers = {}) {
    // Check concurrency budget (The Wave Breathes Rule)
    if (this.activeCount >= this.concurrencyBudget) {
      // Hold in pending queue until a death frees a slot
      this.pendingQueue.push({ archetype, pos, rotY, statMultipliers });
      return null;
    }

    const shell = this.getDormantShell();
    if (!shell) return null;

    shell.awaken(archetype, pos, rotY, statMultipliers);
    this.activeCount++;
    return shell;
  }

  release(shell) {
    if (shell.state === 'DORMANT') return;
    shell.reset();
    this.activeCount = Math.max(0, this.activeCount - 1);

    // Staggered release: immediately awaken next pending enemy if queued
    if (this.pendingQueue.length > 0 && this.activeCount < this.concurrencyBudget) {
      const next = this.pendingQueue.shift();
      this.spawn(next.archetype, next.pos, next.rotY, next.statMultipliers);
    }
  }

  clear() {
    for (let i = 0; i < this.shells.length; i++) {
      this.shells[i].reset();
    }
    this.activeCount = 0;
    this.pendingQueue.length = 0;
  }
}

export const enemyPoolManager = new EnemyPoolManager();
