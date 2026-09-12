import * as THREE from 'three';
import { buildLevel } from './dist/src/level.js';

const mockWorld = { finalize: () => {}, addBox: () => ({ data: {} }) };
const mockScene = { add: () => {} };

try {
  console.log("building district..."); buildLevel(mockScene, mockWorld, 'district');
  console.log("building mexico..."); buildLevel(mockScene, mockWorld, 'mexico');
  console.log("building classroom..."); buildLevel(mockScene, mockWorld, 'classroom');
  console.log("building clockwork..."); buildLevel(mockScene, mockWorld, 'clockwork');
  console.log("All built OK");
} catch(e) {
  console.error(e);
}
