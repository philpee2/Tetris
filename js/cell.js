import Settings from './settings';

class Cell {

  static get DIMENSION() {
    return Settings.cell.DIMENSION;
  }

  static mapToScreen(pos) {
    const [x, y] = pos;
    const pixelX = x * Cell.DIMENSION;
    const pixelY = Settings.game.DIM_Y - ((y + 1) * Cell.DIMENSION);
    return [pixelX, pixelY];
  }

  constructor(pos, block) {
    this.pos = pos;
    this.block = block;
    this.color = block.color;
  }

  drop() {
    this.moveDirection('down');
  }

  moveDirection(direction) {
    switch (direction) {
    case "left":
      this.pos[0] -= 1;
      break;
    case "right":
      this.pos[0] += 1;
      break;
    case "down":
      this.pos[1] -= 1;
      break;
    }
  }

  draw(ctx, pos) {
    // If pos is provided, then this cell is on the game grid, and its own position
    // should be ignored. If pos is not provided, then this cell is in the live
    // block, and its own position should be drawn.
    const position = pos || this.pos;

    // Convert the grid coordinate into a pixel coordinate
    const [x, y] = Cell.mapToScreen(position);
    const dimension = Cell.DIMENSION;
    ctx.fillStyle = this.color;
    ctx.fillRect(x, y, dimension, dimension);
  }

  canMoveDirection(direction, game) {
    const [currX, currY] = [this.getX(), this.getY()];
    switch (direction) {
    case "left":
      return game.validPosition([currX - 1, currY]);
    case "right":
      return game.validPosition([currX + 1, currY]);
    case "down":
      return game.validPosition([currX, currY - 1]);
    }
  }

  rotatedPosition(pivot) {
    // Returns the new position that this cell would be in if it rotated.
    // Does not actually change the cell's position
    const [pivotX, pivotY] = pivot.pos;
    const distanceX = this.pos[0] - pivotX;
    const distanceY = this.pos[1] - pivotY;
    const newX = pivotX - distanceY;
    const newY = pivotY + distanceX;
    return [newX, newY];
  }

  rotateAroundPivot(pivot) {
    const rotatedPos = this.rotatedPosition(pivot);
    this.setX(rotatedPos[0]);
    this.setY(rotatedPos[1]);
  }

  canRotate(pivot, game) {
    const rotatedPos = this.rotatedPosition(pivot);
    return game.validPosition(rotatedPos);
  }

  getX() {
    return this.pos[0];
  }

  getY() {
    return this.pos[1];
  }

  setX(val) {
    this.pos[0] = val;
  }

  setY(val) {
    this.pos[1] = val;
  }
}

export default Cell;
