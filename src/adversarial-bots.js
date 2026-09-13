/**
 * Doodle Strike - Adversarial Bots
 * 
 * Defines 5 distinct player archetypes to stress-test maps during generation.
 * A truly competitive map must score evenly across all archetypes, preventing
 * one playstyle (e.g. sniping) from dominating.
 */

export const BOT_ARCHETYPES = [
  {
    name: 'RUSHER',
    description: 'Aggressive close-range player who sprint-grapples everywhere',
    movementSpeed: 1.3,        // 130% base speed (sprint)
    preferredRange: 8,         // meters
    grappleUsageRate: 0.9,     // uses grapple 90% of available opportunities
    coverUsageRate: 0.1,       // almost never takes cover
    pathfindingBias: 'shortest_path'
  },
  {
    name: 'SNIPER',
    description: 'Patience player who climbs high and holds angles',
    movementSpeed: 0.7,
    preferredRange: 40,
    grappleUsageRate: 0.4,
    coverUsageRate: 0.95,
    pathfindingBias: 'highest_elevation'
  },
  {
    name: 'FLANKER',
    description: 'Routes through side paths to attack from unexpected angles',
    movementSpeed: 1.0,
    preferredRange: 15,
    grappleUsageRate: 0.7,
    coverUsageRate: 0.5,
    pathfindingBias: 'least_traffic_path'
  },
  {
    name: 'CONTROLLER',
    description: 'Holds key positions and denies area access',
    movementSpeed: 0.6,
    preferredRange: 20,
    grappleUsageRate: 0.3,
    coverUsageRate: 0.85,
    pathfindingBias: 'highest_connectivity_node'
  },
  {
    name: 'NEWBIE',
    description: 'Wanders aimlessly, gets lost, falls off things',
    movementSpeed: 0.8,
    preferredRange: 12,
    grappleUsageRate: 0.2,     
    coverUsageRate: 0.3,
    pathfindingBias: 'random_walk'
  }
];

export class AdversarialBotEngine {
  
  /**
   * Calculates how balanced a map is across all archetypes.
   * Uses the coefficient of variation (Standard Deviation / Mean).
   * 
   * @param {Array} archetypeResults Array of objects with { name, successMetric }
   * @returns {Number} Score from 0 to 100. (100 = perfectly balanced)
   */
  calculateBalanceScore(archetypeResults) {
    if (!archetypeResults || archetypeResults.length === 0) return 0;
    
    // Normalize to 0-1 range to handle large variation in raw metrics
    // A simplified metric is just treating the successMetric as a percentage 0-100
    const scores = archetypeResults.map(r => r.successMetric);
    
    const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
    if (mean === 0) return 0; // completely broken map
    
    const variance = scores.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / scores.length;
    const stdDev = Math.sqrt(variance);
    const coefficientOfVariation = stdDev / mean;
    
    // Perfect balance = cv of 0 = score of 100
    // Terrible imbalance = cv of 1+ = score of 0
    const balanceScore = Math.max(0, 100 * (1 - coefficientOfVariation * 2));
    return Math.round(balanceScore);
  }
}
