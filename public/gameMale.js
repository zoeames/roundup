var cursors;
var gameMaleState = {preload: preload, create: create, update: update};
var jumpButton;
var platforms;
var player;



function preload(){

}
//timer variabes
var timer;
var milliseconds = 0;
var seconds = 0;
var minutes = 0;



function create(){
  gameMaleState.physics.startSystem(Phaser.Physics.ARCADE);

  var playerbmd = gameMaleState.add.bitmapData(32, 32);
  playerbmd.ctx.rect(0, 0, 32, 32);
  playerbmd.ctx.fillStyle = "#0f0";
  playerbmd.ctx.fill();

  var enemybmd = gameMaleState.add.bitmapData(32, 32);
  enemybmd.ctx.rect(0, 0, 32, 32);
  enemybmd.ctx.fillStyle = "#ada";
  enemybmd.ctx.fill();

  var platformbmd = gameMaleState.add.bitmapData(80, 16);
  platformbmd.ctx.rect(0, 0, 80, 16);
  platformbmd.ctx.fillStyle = "#f8a34b";
  platformbmd.ctx.fill();

  player = gameMaleState.add.sprite(gameMaleState.world.centerX, gameMaleState.world.centerY, playerbmd);
  gameMaleState.physics.enable(player, Phaser.Physics.ARCADE);
  player.anchor.set(0.5, 0.5);
  player.body.collideWorldBounds = true;
  player.body.gravity.y = 900;
  platforms = gameMaleState.add.group();
  platforms.enableBody = true;
  platforms.physicsBodyType = Phaser.Physics.ARCADE;
  platforms.createMultiple(7, platformbmd);
  platforms.forEach(function(p){
    var x = Math.floor(Math.random()*720) + 1;
    var y = Math.floor(Math.random()*504) + 96;
    p.reset(x, y);
    p.body.immovable = true;
  }, this);
  ground = platforms.create(0, gameMaleState.world.height - 64, platformbmd);
  ground.scale.setTo(12, 4);
  ground.body.immovable = true;
  enemies = gameMaleState.add.group();
  enemies.enableBody = true;
  enemies.physicsBodyType = Phaser.Physics.ARCADE;
  enemies.createMultiple(6, enemybmd);
  enemies.forEach(function(e){
    var x = Math.floor(Math.random()*720) + 1;
    var y = Math.floor(Math.random()*472) + 128;
    e.reset(x, y);
    e.body.collideWorldBounds  = true;
    e.body.gravity.y = 900;
  }, this);
  cursors = gameMaleState.input.keyboard.createCursorKeys();
  jumpButton = gameMaleState.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

  timer = gameMaleState.add.text(0,0, '00:00:00');
  console.log(timer);

}

function update(){
  gameMaleState.physics.arcade.collide(player, ground);
  gameMaleState.physics.arcade.collide(player, platforms);
  gameMaleState.physics.arcade.collide(enemies, ground);
  gameMaleState.physics.arcade.collide(enemies, platforms);
  movePlayer();

  //timer
  updateTimer();
}

function movePlayer(){
  player.body.velocity.x = 0;
  if(cursors.left.isDown){
    player.scale.x = -1;
    player.body.velocity.x = -150;
    if(jumpButton.isDown && player.body.touching.down){
      player.body.velocity.y = -550;
      //jumpTimer = gameMaleState.time.now + 750;
    }
  }else if(cursors.right.isDown){
    player.body.velocity.x = 150;
    if(jumpButton.isDown && player.body.touching.down){
      player.body.velocity.y = -550;
      //jumpTimer = gameMaleState.time.now + 750;
    }
  }else if(jumpButton.isDown && player.body.touching.down){
    player.body.velocity.y = -550;
  }
}


//timer
function updateTimer() {

    minutes = Math.floor(gameMaleState.time.time / 60000) % 60;

    seconds = Math.floor(gameMaleState.time.time / 1000) % 60;

    milliseconds = Math.floor(gameMaleState.time.time) % 100;

    //If any of the digits becomes a single digit number, pad it with a zero
    if (milliseconds < 10)
        milliseconds = '0' + milliseconds;

    if (seconds < 10)
        seconds = '0' + seconds;

    if (minutes < 10)
        minutes = '0' + minutes;

    console.log(timer);

    timer.setText(minutes + ':'+ seconds + ':' + milliseconds);

}
