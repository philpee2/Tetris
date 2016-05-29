import Game from './js/game';
import $ from 'jquery';

$(function() {
  const gameElement = document.getElementById('game');
  const gameContext = gameElement.getContext('2d');
  const tetrisGame = new Game(gameContext);
  tetrisGame.start();
});
