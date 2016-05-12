var Game = require('./game.js');

document.addEventListener("DOMContentLoaded", function(){
  var canvasEl = document.getElementsByTagName("canvas")[0];
  canvasEl.width = 480;
  canvasEl.height = 720;

  var ctx = canvasEl.getContext("2d");
  var gameInstance = new Game(ctx, canvasEl);
  gameInstance.start();

});
