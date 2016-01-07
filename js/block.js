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
      return new Cell(pos.slice(), block);
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
      this.cells.forEach(function(cell) {
        cell.rotateAroundPivot(pivot);
      });
    }
  };

  Block.prototype.canRotate = function() {
    // An O block cannot rotate
    if (this.type === "O") {
      return false;
    }

    var pivot = this.cells[0];
    var game = this.game;
    return _.all(this.cells, function(cell) {
      return cell.canRotate(pivot, game);
    });
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
    var game = this.game;
    if (this.canMoveDirection("down")) {
      this.cells.forEach(function(cell) {
        cell.drop();
      });
    } else {
      // If a block cannot drop further, place it on the grid.
      game.blockPlaced(this);
    }
  };

  Block.prototype.aboveTop = function() {
    var game = this.game;
    return _.any(this.cells, function(cell) {
      return cell.getY() >= game.HEIGHT - 1;
    });
  };

  Block.prototype.quickDrop = function() {
    while (this.canMoveDirection("down")) {
      this.drop();
    }
  };

  Block.prototype.canMoveDirection = function(direction) {
    var game = this.game;
    return _.all(this.cells, function(cell) {
      return cell.canMoveDirection(direction, game);
    });
  };

})(this);
