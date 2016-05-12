
// have an array of arrays and each index represents increasing levels and difficulties
var Game = function(ctx, canvasEl) {
  this.words = ['jeff', 'michelle','nguyen','hi','bye','why','zebra']; 
  this.ctx = ctx;
  this.canvasEl = canvasEl;
  this.wordQueue = [];
  this.count = 0;
  this.currentTarget = null;

  // for setSnow
  this.mp = 25; //max particles
  this.particles = [];
};

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

function isEmpty(object) {
  for(var key in object) {
    if(object.hasOwnProperty(key)){
      return false;
    }
  }
  return true;
}

Game.prototype.searchString = function(code){
  if (code === 8){
    // clear autolock
    this.currentTarget = null;
    return {};
  }
  else {

    for (var idx in this.wordQueue){

      if (this.wordQueue[idx].text.charAt(0) === String.fromCharCode(code).toLowerCase()) {

        if (this.currentTarget === null){
          this.currentTarget = this.wordQueue[idx].text.substring(1);
          this.wordQueue[idx].text = this.wordQueue[idx].text.substring(1);
          var temp = {word: this.wordQueue[idx]}
          return temp;
        }
        else {
          if (this.currentTarget === this.wordQueue[idx].text){
            if (this.wordQueue[idx].text.substring(1).length === 0){
              // reset currentTarget to find new ones
              this.currentTarget = null;
              this.wordQueue[idx].text = this.wordQueue[idx].text.substring(1);
              var temp = {word: this.wordQueue[idx]}
              // remove the empty string from the queue
              this.wordQueue.splice(idx, 1);
              return temp;
            } else {
              this.currentTarget = this.wordQueue[idx].text.substring(1);
              this.wordQueue[idx].text = this.wordQueue[idx].text.substring(1);
              var temp = {word: this.wordQueue[idx]}
              return temp;
            }
          }
        }

      }
    }
    return {};
  } 
}

Game.prototype.dropLetter = function() {

  this.ctx.clearRect(0,0, this.canvasEl.width, this.canvasEl.height);

  this.count++;
  if (this.count === 10){
    var posX = Math.random() * 480;
    var posY = 0;

    if (this.words.length > 0){
      var poppedWord = this.words.pop();
      var word = {text: poppedWord, x: posX, y: posY};

      this.wordQueue.push(word);
      this.count = 0;
    }
  }

  this.ctx.fillStyle = "#042fcf";
  for (var i=0; i < this.wordQueue.length; i++){
    if(this.wordQueue[i].y <= (this.canvasEl.height)-1) {
      if (this.currentTarget === this.wordQueue[i].text){
        this.ctx.fillStyle ="#ff0000";
      }
      else {
        this.ctx.fillStyle ="#ffffff";
      }
      this.wordQueue[i].y += 2;
      this.ctx.fillText(this.wordQueue[i].text, this.wordQueue[i].x, this.wordQueue[i].y);
    }
    else {
      var finishedWord = this.wordQueue.shift();
      this.words.push(finishedWord.text);
      this.count = 0;
    }
  }

};

Game.prototype.createSnow = function(){
  // http://jsfiddle.net/Arg0n/a05zvtkw/1/
  // this.ctx.clearRect(0, 0, this.canvasEl.width, this.canvasEl.height);

  this.ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
  this.ctx.beginPath();
  for(var i = 0; i < this.mp; i++)
  {
      var p = this.particles[i];
      this.ctx.moveTo(p.x, p.y);
      this.ctx.arc(p.x, p.y, p.r, 0, Math.PI*2, true);
  }
  this.ctx.fill();

//Function to move the snowflakes
//angle will be an ongoing incremental flag. Sin and Cos functions will be applied to it to create vertical and horizontal movements of the flakes
  var angle = 0;

  angle += 0.01;
  for(var i = 0; i < this.mp; i++)
  {
      var p = this.particles[i];
      //Updating X and Y coordinates
      //We will add 1 to the cos function to prevent negative values which will lead flakes to move upwards
      //Every particle has its own density which can be used to make the downward movement different for each flake
      //Lets make it more random by adding in the radius
      p.y += Math.cos(angle+p.d) + 1 + p.r/2;
      p.x += Math.sin(angle) * 2;

      //Sending flakes back from the top when it exits
      //Lets make it a bit more organic and let flakes enter from the left and right also.
      if(p.x > this.canvasEl.width+5 || p.x < -5 || p.y > this.canvasEl.height)
      {
          if(i%3 > 0) //66.67% of the flakes
          {
              this.particles[i] = {x: Math.random()*this.canvasEl.width, y: -10, r: p.r, d: p.d};
          }
          else
          {
              //If the flake is exiting from the right
              if(Math.sin(angle) > 0)
              {
                  //Enter from the left
                  this.particles[i] = {x: -5, y: Math.random()*this.canvasEl.height, r: p.r, d: p.d};
              }
              else
              {
                  //Enter from the right
                  this.particles[i] = {x: this.canvasEl.width+5, y: Math.random()*this.canvasEl.height, r: p.r, d: p.d};
              }
          }
      }
  }

  var img = new Image();
  img.src = 'http://www.zeldawiki.org/images/thumb/a/a6/Air_Cannon.png/120px-Air_Cannon.png'
  this.ctx.drawImage(img, 240, 690, 25, 25);
}


Game.prototype.start = function(){

  // set snow background
  for(var i = 0; i < this.mp; i++)
  {
      this.particles.push({
          x: Math.random()*this.canvasEl.width, //x-coordinate
          y: Math.random()*this.canvasEl.height, //y-coordinate
          r: Math.random()*4+1, //radius
          d: Math.random()*this.mp //density
      })
  }

  
  setInterval(function(){
    this.dropLetter();
    this.createSnow();
  }.bind(this), 30);

  var canvas = document.getElementById('canvas-typer')
  
  canvas.addEventListener('keydown', function(event) {
    var potentialHit = this.searchString(event.keyCode);

    if (!isEmpty(potentialHit)){
      var score =$('#score').text();
      var current = parseInt(score) + parseInt('100');
      $('#score').text(current);
      var word = potentialHit.word;
      this.ctx.beginPath();
      this.ctx.strokeStyle = "#ffa500";
      this.ctx.lineWidth = 2;
      this.ctx.moveTo(240, 690);
      this.ctx.lineTo(word.x, word.y); 
      this.ctx.stroke();
      this.ctx.closePath();
    }
  }.bind(this), false);
}

module.exports = Game;