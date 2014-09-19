(function(root) {
  var TetrisGame = root.TetrisGame = (root.TetrisGame || {});
  var Settings = TetrisGame.Settings;
  var Block = TetrisGame.Block;
  var Cell = TetrisGame.Cell; 

  var Game = TetrisGame.Game = function(ctx) {
    this.ctx = ctx;
    
    // Constants representing the number of rows and columns 
    this.WIDTH = Settings.game.WIDTH;
    this.HEIGHT = Settings.game.HEIGHT;
    
    // The grid is a 2D array containing either nulls, or cell 
    // objects. It represents
    // the game's grid of cells. 
    this.grid = createEmptyGrid(this.WIDTH, this.HEIGHT);
    
    // Speed represents how fast blocks move. 
    this.speed = 3;
    
    // This is the block that the player can currently control. 
    this.block = Block.randomBlock(this);
    
    this.frame = 0;
    
    // The player's current score in the game. 
    this.score = 0;
    
    this.bindKeyHandlers();
  };
  
  Game.FPS = Settings.game.FPS;
  Game.DIM_X = Settings.game.DIM_X;
  Game.DIM_Y = Settings.game.DIM_Y;
  Game.SCORE_MAP = Settings.game.SCORE_MAP

  
  Game.prototype.getGridItem = function(pos) {
    return this.grid[pos[1]][pos[0]];
  };
  
  Game.prototype.setGridItem = function(pos, item) {
    this.grid[pos[1]][pos[0]] = item;
  };
  
  Game.prototype.isEmpty = function(pos) {
    return !this.getGridItem(pos);
  };
  
  Game.prototype.start = function() {
    // Begin running the 'step' logic 30 times per second. 
    
    var that = this;
    var interval = Math.floor(1000/Game.FPS);
    this.intervalID = window.setInterval(that.step.bind(that), interval);
  };
  
  Game.prototype.step = function() {
    // The game is rendered 30 times per second, but blocks drop at a slower 
    // rate, which is determined by the speed instance variable. 
    
    var movesPerSecond = Game.FPS / this.speed; 
    if (this.frame % movesPerSecond == 0) {
      this.move();
    }
    this.frame = (this.frame + 1) % Game.FPS
    this.draw();
  };
  
  Game.prototype.move = function() {
    this.block.drop();
  };
  
  Game.prototype.draw = function() {
    // Every frame, the canvas is cleared and both the block and grid are redrawn.
    
    this.ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
    this.block.draw(this.ctx);
    this.drawGrid();
  };
  
  Game.prototype.drawGrid = function() {
    for (var i = 0; i < this.WIDTH; i++) {
      for (var j = 0; j < this.HEIGHT; j++) {
        var cell = this.getGridItem([i, j]);
        if (cell) { 
          
          // If the cell's draw method is given a position, it ignores the cell's own
          // position and draws at the given one instead. 
          cell.draw(this.ctx, [i, j]);
        }
      }
    }
  };
  
  Game.prototype.stop = function(){
    clearInterval(this.intervalID);
  };
  
  Game.prototype.gameOver = function() {
    this.stop();
    alert("Game Over! Your score is " + this.score);
  };
  
  Game.prototype.bindKeyHandlers = function() {
    var game = this; 
    key("up", function() {
      game.block.rotate();
    });
    
    key("down", function() {
      game.block.drop();
    });
    
    key("left", function() {
      game.block.moveDirection("left");
    });
    
    key("right", function() {
      game.block.moveDirection("right");
    });
    
    key("space", function() {
      game.block.quickDrop();
    });
    
		key("P", function(){
			game.togglePause();
		});
  };
  
	Game.prototype.togglePause = function(){
		if (this.paused){
      // Unpause
			this.start();
			this.paused = false; 
		} else {
      // Pause
			this.stop(); 
			this.paused = true; 
		}
	};
  
  Game.prototype.checkForLines = function() {
    // Check if the player has cleared any full lines. 
    
    var i = 0; 
    // More points are awarded if a player clears multiple lines with one drop.
    var numLines = 0;  
    while (i < this.HEIGHT) {
      var row = this.grid[i];
      if (this.containsLine(row)) {
        numLines++;
        this.clearLine(i);
      } else {
        i++; 
      }
    }
    this.awardPoints(numLines);
  };
  
  Game.prototype.containsLine = function(row) {
    // Returns true if the array row is completely full of cells.
    
    for (var i = 0; i < row.length; i++) {
      var cell = row[i];
      if (!cell) {
        return false;
      }
    }
    return true;
  };
  
  Game.prototype.clearLine = function(rowIndex) {
    // Remove the row at rowIndex, and push an empty row to the top of the grid.
    
    this.grid.splice(rowIndex, 1);
    var row = new Array(this.WIDTH);
    for (var i = 0; i < row.length; i++) {
      row[i] = null
    }
    this.grid.push(row);
  };
  
  Game.prototype.awardPoints = function(numLines) {
    // Update the player's score, and update the HTML that displays the score. 
    
    this.score += (this.speed * Game.SCORE_MAP[numLines]);
    $("#score").html(this.score);
  };
  
  Game.prototype.validPosition = function(pos) {
    var x = pos[0];
    var y = pos[1];
    return (x >= 0) && (x < this.WIDTH) && (y >= 0) && (y < this.HEIGHT) 
      && (this.isEmpty(pos));
  }
  
  var createEmptyGrid = function(width, height) {
    var grid = new Array(height);
    for (var i = 0; i < grid.length; i++) {
      var row = new Array(width);
      for (var j = 0; j < row.length; j++) {
        row[j] = null;
      }
      grid[i] = row; 
    }
    
    return grid;
  };
})(this);