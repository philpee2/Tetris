import Settings from './settings';
import Cell from './cell';
import { sample, some, every } from 'lodash';

// The block represents the group of four cells that the player controls at any given
// time. It stores an array of cells.
// Given a type of block, the constructor determines its color and the starting
// position of its cells
class Block {

  static TYPES = Settings.block.TYPES;
  static STARTING_POSITIONS = Settings.block.STARTING_POSITIONS;
  static TYPE_COLORS = Settings.block.TYPE_COLORS;

  static randomBlock(game) {
    const type = sample(Block.TYPES);
    return new Block(game, type);
  }

  constructor(game, type) {
    this.game = game;
    this.color = Block.TYPE_COLORS[type];
    this.type = type;

    const positions = Block.STARTING_POSITIONS[type];
    this.cells = positions.map(pos => new Cell(pos.slice(), this));
  }

  rotate() {
    if (this.canRotate()) {
      // The first cell in a block represents the 'pivot', which other cells
      // rotate around
      const pivot = this.cells[0];
      this.cells.forEach(cell => cell.rotateAroundPivot(pivot));
    }
  }

  canRotate() {
    // An O block cannot rotate
    if (this.type === "O") {
      return false;
    }

    const pivot = this.cells[0];
    return every(this.cells, (cell) => cell.canRotate(pivot, this.game));
  }

  moveDirection(direction) {
    if (this.canMoveDirection(direction)) {
      this.cells.forEach(cell => cell.moveDirection(direction));
    }
  }

  draw(ctx) {
    this.cells.forEach(cell => cell.draw(ctx));
  }

  drop() {
    if (this.canMoveDirection("down")) {
      this.cells.forEach(cell => cell.drop());
    } else {
      // If a block cannot drop further, place it on the grid.
      this.game.blockPlaced(this);
    }
  }

  aboveTop() {
    return some(this.cells, cell => cell.getY() >= this.game.HEIGHT - 1);
  }

  quickDrop() {
    while (this.canMoveDirection("down")) {
      this.drop();
    }
  }

  canMoveDirection(direction) {
    return every(this.cells, cell => cell.canMoveDirection(direction, this.game));
  }

}

export default Block;
