(function(root) {
  var TetrisGame = root.TetrisGame = (root.TetrisGame || {});
  var Settings = TetrisGame.Settings;
  var Cell = TetrisGame.Cell;

  // The block represents the group of four cells that the player controls at any given
  // time. It stores an array of cells.
  // Given a type of block, the constructor determines its color and the starting
  // position of its cells
  var Block = TetrisGame.Block = function(game, type) {
    this.game = game;
    this.color = Block.TYPE_COLORS[type];
    this.type = type;

    var block = this;
    var positions = Block.STARTING_POSITIONS[type];
    this.cells = positions.map(function(pos) {
      return new Cell(pos.slice(0), block);
    });
  };

  Block.TYPES = Settings.block.TYPES;
  Block.STARTING_POSITIONS = Settings.block.STARTING_POSITIONS;
  Block.TYPE_COLORS = Settings.block.TYPE_COLORS;

  Block.randomBlock = function(game) {
    var type = _.sample(Block.TYPES);
    return new Block(game, type);
  };

  Block.prototype.rotate = function() {
    if (this.canRotate()) {
      // The first cell in a block represents the 'pivot', which other cells
      // rotate around
      var pivot = this.cells[0];
      for (var i = 1; i < this.cells.length; i++) {
        var cell = this.cells[i];
        cell.rotateAroundPivot(pivot);
      }
    }
  };

  Block.prototype.canRotate = function() {
    // An O block cannot rotate
    if (this.type === "O") {
      return false;
    }

    var pivot = this.cells[0];
    for (var i = 1; i < this.cells.length; i++) {
      var cell = this.cells[i];
      if (!cell.canRotate(pivot)) {
        return false;
      }
    }
    return true;
  }

  Block.prototype.moveDirection = function(direction) {
    if (this.canMoveDirection(direction)) {
      this.cells.forEach(function(cell) {
        cell.moveDirection(direction);
      });
    }
  };

  Block.prototype.draw = function(ctx) {
    this.cells.forEach(function(cell){
      cell.draw(ctx);
    });
  };

  Block.prototype.drop = function() {
    var block = this;
    if (this.canMoveDirection("down")) {
      this.cells.forEach(function(cell) {
        cell.drop();
      });
    } else {
      // If a block cannot drop further, update the game grid, create a new random block,
      // and check to see if the player has cleared any lines.
      this.cells.forEach(function(cell) {
        block.game.setGridItem(cell.pos, cell);
      });
      if (this.aboveTop()) {
        this.game.gameOver();
      }
      this.game.block = Block.randomBlock(this.game);
      this.game.checkForLines();
    }
  };

  Block.prototype.aboveTop = function() {
    for (var i = 0; i < this.cells.length; i++) {
      var cell = this.cells[i];
      if (cell.getY() >= this.game.HEIGHT - 1) {
        return true;
      }
    }
    return false;
  };

  Block.prototype.quickDrop = function() {
    while (this.canMoveDirection("down")) {
      this.drop();
    }
  };

  Block.prototype.canMoveDirection = function(direction) {
    var game = this.game;
    for (var i = 0; i < this.cells.length; i++) {
      var cell = this.cells[i];
      if (!cell.canMoveDirection(direction, game)) {
        return false;
      }
    }
    return true;
  };

})(this);
