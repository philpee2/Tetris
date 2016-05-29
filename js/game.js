import Settings from './settings';
import Block from './block';
import key from 'keymaster';
import $ from 'jquery';
import { every } from 'lodash';

class Game {

  static get FPS() {
    return Settings.game.FPS;
  }

  static get DIM_X() {
    return Settings.game.DIM_X;
  }

  static get DIM_Y() {
    return Settings.game.DIM_Y;
  }

  static get SCORE_MAP() {
    return Settings.game.SCORE_MAP;
  }

  constructor(ctx) {
    this.ctx = ctx;

    // Constants representing the number of rows and columns
    this.WIDTH = Settings.game.WIDTH;
    this.HEIGHT = Settings.game.HEIGHT;

    // Speed represents how fast blocks move.
    this.speed = 3;

    this.paused = false;

    this.bindKeyHandlers();

    this.initializeNewGameState();
  }

  initializeNewGameState() {
    // The player's current score in the game.
    this.score = 0;
    $("#score").html(this.score);

    // The grid is a 2D array containing either nulls, or cell
    // objects. It represents the game's grid of cells.
    this.grid = this.createEmptyGrid(this.WIDTH, this.HEIGHT);

    // This is the block that the player can currently control.
    this.block = Block.randomBlock(this);
    this.frame = 0;
  }

  getGridItem(pos) {
    return this.grid[pos[1]][pos[0]];
  }

  setGridItem(pos, item) {
    this.grid[pos[1]][pos[0]] = item;
  }

  isEmpty(pos) {
    return this.getGridItem(pos) === undefined;
  }

  start() {
    // Begin running the 'step' logic 30 times per second.
    const interval = Math.floor(1000/Game.FPS);
    this.intervalID = window.setInterval(this.step.bind(this), interval);
  }

  step() {
    // The game is rendered 30 times per second, but blocks drop at a slower
    // rate, which is determined by the speed instance variable.
    const movesPerSecond = Game.FPS / this.speed;
    if (this.frame % movesPerSecond === 0) {
      this.move();
    }
    this.frame = (this.frame + 1) % Game.FPS;
    this.draw();
  }

  move() {
    this.block.drop();
  }

  draw() {
    // Every frame, the canvas is cleared and both the block and grid are redrawn.
    this.ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
    this.block.draw(this.ctx);
    this.drawGrid();
  }

  drawGrid() {
    for (let i = 0; i < this.WIDTH; i++) {
      for (let j = 0; j < this.HEIGHT; j++) {
        const cell = this.getGridItem([i, j]);
        if (cell) {
          // If the cell's draw method is given a position, it ignores the cell's own
          // position and draws at the given one instead.
          cell.draw(this.ctx, [i, j]);
        }
      }
    }
  }

  stop(){
    clearInterval(this.intervalID);
  }

  gameOver() {
    this.stop();
    const again = confirm(`Game Over! Your score is ${this.score}. Do you want to play again?`);
    if (again) {
      this.restart();
    }
  }

  restart() {
    this.initializeNewGameState();
    this.start();
  }

  bindKeyHandlers() {
    key("up", () => this.block.rotate());

    key("down", () => this.block.drop());

    key("left", () => this.block.moveDirection("left"));

    key("right", () => this.block.moveDirection("right"));

    key("space", () => this.block.quickDrop());

    key("P", () => this.togglePause());
  }

  togglePause(){
    if (this.paused){
      // Unpause
      this.start();
      this.paused = false;
    } else {
      // Pause
      this.stop();
      this.paused = true;
    }
  }

  checkForLines() {
    // Check if the player has cleared any full lines.

    var i = 0;
    // More points are awarded if a player clears multiple lines with one drop.
    var numLines = 0;
    while (i < this.HEIGHT) {
      let row = this.grid[i];
      if (this.containsLine(row)) {
        numLines++;
        this.clearLine(i);
      } else {
        i++;
      }
    }
    this.awardPoints(numLines);
  };

  // Returns true if the array row is completely full of cells.
  containsLine(row) {
    return every(row);
  }

  clearLine(rowIndex) {
    // Remove the row at rowIndex, and push an empty row to the top of the grid.
    this.grid.splice(rowIndex, 1);
    const row = new Array(this.WIDTH);
    this.grid.push(row);
  }

  awardPoints(numLines) {
    // Update the player's score, and update the HTML that displays the score.
    this.score += (this.speed * Game.SCORE_MAP[numLines]);
    $("#score").html(this.score);
  }

  validPosition(pos) {
    const x = pos[0];
    const y = pos[1];
    return (x >= 0) && (x < this.WIDTH) && (y >= 0) && (y < this.HEIGHT)
      && (this.isEmpty(pos));
  }

  createEmptyGrid(width, height) {
    const grid = new Array(height);
    for (let i = 0; i < grid.length; i++) {
      let row = new Array(width);
      grid[i] = row;
    }

    return grid;
  }

  setBlockOnGrid(block) {
    block.cells.forEach( (cell) => this.setGridItem(cell.pos, cell));
  }

  // Called when a block is placed onto the grid. Update the grid, create a new
  //  random block, and check to see if the player has cleared any lines.
  blockPlaced(block) {
    this.setBlockOnGrid(block);
    if (block.aboveTop()) {
      this.gameOver();
    }
    this.block = Block.randomBlock(this);
    this.checkForLines();
  }
}

export default Game;
