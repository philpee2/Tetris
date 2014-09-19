(function(root) {
  var TetrisGame = root.TetrisGame = (root.TetrisGame || {});
  var Settings = TetrisGame.Settings; 
  
  var Cell = TetrisGame.Cell = function(pos, block) {
    this.pos = pos; 
    this.block = block;
    this.color = block.color;
  };
  
  Cell.DIMENSION = Settings.cell.DIMENSION;

  Cell.prototype.drop = function() {
    this.moveDirection("down");
  };
  
  Cell.prototype.moveDirection = function(direction) {
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
  
  Cell.prototype.draw = function(ctx, pos) {
    // If pos is provided, then this cell is on the game grid, and its own position 
    // should be ignored. If pos is not provided, then this cell is in the live 
    // block, and its own position should be drawn.
    var pixelPos;
    if (pos === undefined) {
      pixelPos = Cell.mapToScreen(this.pos);
    } else {
      pixelPos = Cell.mapToScreen(pos)
    }
    var x = pixelPos[0];
    var y = pixelPos[1];
    var dim = Cell.DIMENSION
    ctx.fillStyle = this.color;
    ctx.fillRect(x, y, dim, dim);
  };
  
  Cell.mapToScreen = function(pos) {
    var x = pos[0];
    var y = pos[1];
    var pixelX = x * Cell.DIMENSION; 
    var pixelY = Settings.game.DIM_Y - ((y + 1) * Cell.DIMENSION);
    return [pixelX, pixelY]
  };
  
  Cell.prototype.canMoveDirection = function(direction, game) {
    var currX = this.getX();
    var currY = this.getY();
    switch (direction) {
    case "left":
      return game.validPosition([currX - 1, currY]);
    case "right": 
      return game.validPosition([currX + 1, currY]);
    case "down":
      return game.validPosition([currX, currY - 1]);
    }
  };
  
  Cell.prototype.rotateAroundPivot = function(pivot) {
    var pivotX = pivot.pos[0];
    var pivotY = pivot.pos[1];
    var distanceX = this.pos[0] - pivotX;
    var distanceY = this.pos[1] - pivotY;
    this.setX(pivotX - distanceY);
    this.setY(pivotY + distanceX);
  };
  
  Cell.prototype.canRotate = function(pivot) {
    var game = this.block.game; 
    
    var pivotX = pivot.pos[0];
    var pivotY = pivot.pos[1];
    var distanceX = this.pos[0] - pivotX;
    var distanceY = this.pos[1] - pivotY;
    var newX = pivotX - distanceY;
    var newY = pivotY + distanceX;
    return game.validPosition([newX, newY]);
  };
  
  Cell.prototype.getX = function() {
    return this.pos[0];
  };
  
  Cell.prototype.getY = function() {
    return this.pos[1];
  }; 
  
  Cell.prototype.setX = function(val) {
    this.pos[0] = val;
  };
  
  Cell.prototype.setY = function(val) {
    this.pos[1] = val;
  };
  
})(this);