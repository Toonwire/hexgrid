import { Constants, generateGUID } from './utils';

class Hexagon {
  constructor(cube) {
    this.id = generateGUID();
    this.cube = cube;
    this.resources = 0;
    this.ownerId = Constants.HexOwner.NONE;
    this.maxGrowth = 100;
    this.neighbors = [];
  }
}

export default Hexagon;
