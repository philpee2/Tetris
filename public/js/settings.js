(function(root) {
  var TetrisGame = root.TetrisGame = (root.TetrisGame || {});
  var Settings = TetrisGame.Settings = {
    game: {
      FPS: 30,
      DIM_X: 250, 
      DIM_Y: 500, 
      WIDTH: 10,
      HEIGHT: 20,
      SCORE_MAP: {
        0: 0, 
        1: 40, 
        2: 100, 
        3: 300, 
        4: 1200
      }
    }, 
    
    block: {
      TYPES: ["L", "T", "S", "Z", "O", "I", "F"],
      // TYPES: ["L"],
      STARTING_POSITIONS: {
        L: [[5, 19], [4, 19], [6, 19], [4, 18]],
        T: [[5, 18], [5, 19], [4, 18], [6, 18]],
        S: [[5, 18], [4, 18], [5, 19], [6, 19]],
        Z: [[5, 19], [4, 19], [5, 18], [6, 18]],
        O: [[4, 18], [4, 19], [5, 18], [5, 19]],
        I: [[6, 19], [4, 19], [5, 19], [7, 19]],
        F: [[5, 19], [4, 19], [6, 19], [6, 18]]
      },
      TYPE_COLORS: {
        L: "red",
        T: "blue",
        S: "blueviolet",
        Z: "green",
        O: "gold",
        I: "cadetblue",
        F: "darkgray"
      }
    },
    
    cell: {
      DIMENSION: 25,
    }
  };
  
  
})(this);