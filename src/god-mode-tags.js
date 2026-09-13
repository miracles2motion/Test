/**
 * Doodle Strike - God Mode AI Tags & Stats
 * Applied to enemies when difficulty === 4.
 */

export const GOD_MODE_TAGS = {
  canParry: true,        // React to melee swings with a parry/counter
  canKite: true,         // Sustained backward movement while firing
  canCoordinate: true,   // Participate in group tactics
  canVerticalEscape: true, // Use grapple to escape melee range vertically
  canBait: true,         // Willing to be the "bait" in bait-and-switch
  canHoldFire: true,     // Can suppress fire and wait for optimal moment
  canPredictMelee: true, // Reads player melee wind-up animations
  canAreaDeny: true,     // Throws grenades at own feet to deny approach
  canSoundHunt: true,    // Converges on gunshots
  canAdaptLoadout: true, // Switches weapons based on player distance
};

export const GOD_MODE_STATS = {
  reactionTime: 0.15,       // 150ms (human average is 250ms)
  aimAccuracy: 0.92,        // 92% hit rate at optimal range
  dodgeWindow: 0.3,         // starts dodging 300ms before projectile arrives
  spacingAwareness: 1.0,    // full spacing control
  groupCoordination: 1.0,   // full group tactics
  meleeCounterSkill: 0.85,  // 85% chance to parry a melee attack
  verticalMobility: 1.0,    // will use grapple points aggressively
};
