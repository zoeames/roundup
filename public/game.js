var cursors;
var gameState = {preload: preload, create: create, update: update};
var jumpButton;
var platforms;
var player;


function preload(){
}

function create(){
  game.physics.startSystem(Phaser.Physics.ARCADE);
  var playerbmd = game.add.bitmapData(32, 32);
  playerbmd.ctx.rect(0, 0, 32, 32);
  playerbmd.ctx.fillStyle = "#0f0";
  playerbmd.ctx.fill();

  var enemybmd = game.add.bitmapData(32, 32);
  enemybmd.ctx.rect(0, 0, 32, 32);
  enemybmd.ctx.fillStyle = "#ada";
  enemybmd.ctx.fill();

  var platformbmd = game.add.bitmapData(80, 16);
  platformbmd.ctx.rect(0, 0, 80, 16);
  platformbmd.ctx.fillStyle = "#f8a34b";
  platformbmd.ctx.fill();

  player = game.add.sprite(game.world.centerX, game.world.centerY, playerbmd);
  game.physics.enable(player, Phaser.Physics.ARCADE);
  player.anchor.set(0.5, 0.5);
  player.body.collideWorldBounds = true;
  player.body.gravity.y = 900;
  platforms = game.add.group();
  platforms.enableBody = true;
  platforms.physicsBodyType = Phaser.Physics.ARCADE;
  platforms.createMultiple(7, platformbmd);
  platforms.forEach(function(p){
    var x = Math.floor(Math.random()*720) + 1;
    var y = Math.floor(Math.random()*504) + 96;
    p.reset(x, y);
    p.body.immovable = true;
  }, this);
  ground = platforms.create(0, game.world.height - 64, platformbmd);
  ground.scale.setTo(12, 4);
  ground.body.immovable = true;
  enemies = game.add.group();
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
  cursors = game.input.keyboard.createCursorKeys();
  jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);


}

function update(){
  game.physics.arcade.collide(player, ground);
  game.physics.arcade.collide(player, platforms);
  game.physics.arcade.collide(enemies, ground);
  game.physics.arcade.collide(enemies, platforms);
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
      //jumpTimer = game.time.now + 750;
    }
  }else if(cursors.right.isDown){
    player.body.velocity.x = 150;
    if(jumpButton.isDown && player.body.touching.down){
      player.body.velocity.y = -550;
      //jumpTimer = game.time.now + 750;
    }
  }else if(jumpButton.isDown && player.body.touching.down){
    player.body.velocity.y = -550;
  }
}
