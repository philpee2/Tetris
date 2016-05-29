import Game from './js/game';
import $ from 'jquery';

$(function() {
  var gameElement = document.getElementById("game");
  var gameContext = gameElement.getContext("2d");
  var tetrisGame = new Game(gameContext);
  tetrisGame.start();
});
