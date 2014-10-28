var cursors;
var emitter;
var gameState = {preload: preload, create: create, update: update};
var jumpButton;
var platforms;
var player;


var score = 0;
function preload(){
  game.load.image('star', 'star-blood.png');
}

//timer variabes
var timer;
var milliseconds = 0;
var seconds = 0;
var minutes = 0;


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

  var enemy2bmd = game.add.bitmapData(32, 32);
  enemy2bmd.ctx.rect(0, 0, 32, 32);
  enemy2bmd.ctx.fillStyle = "#fd2";
  enemy2bmd.ctx.fill();

  var platformbmd = game.add.bitmapData(80, 16);
  platformbmd.ctx.rect(0, 0, 80, 16);
  platformbmd.ctx.fillStyle = "#f8a34b";
  platformbmd.ctx.fill();

  player = game.add.sprite(game.world.centerX, game.world.centerY, playerbmd);
  game.physics.enable(player, Phaser.Physics.ARCADE);
  player.anchor.set(0.5, 0.5);
  //player.body.collideWorldBounds = true;
  player.body.gravity.y = 900;
  game.world.wrap(player);
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
    e.body.gravity.y = 900;
  }, this);
  enemiez = game.add.group();
  enemiez.enableBody = true;
  enemiez.physicsBodyType = Phaser.Physics.ARCADE;
  enemiez.createMultiple(6, enemy2bmd);
  emitter = game.add.emitter(0, 0, 15);
  emitter.makeParticles('star');
  emitter.setYSpeed(-150, 150);
  emitter.setXSpeed(-150, 150);
  emitter.gravity = 0;

  cursors = game.input.keyboard.createCursorKeys();
  jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
  game.time.events.loop(1000, function(){
    enemies.forEachAlive(function(e){
      e.body.velocity.x = 115 * Phaser.Math.randomSign();
    }, this);
  }, this);
  game.time.events.loop(1000, function(){
    enemiez.forEachAlive(function(e){
      e.body.velocity.x = 115 * Phaser.Math.randomSign();
    }, this);
  }, this);
  game.time.events.loop(1500, function(){
    enemiez.forEachAlive(function(e){
      e.body.velocity.y = 655 * Phaser.Math.randomSign();
    }, this);
  }, this);

  timer = gameMaleState.add.text(0,0, '00:00:00');
  console.log(timer);

}

function update(){
  game.physics.arcade.collide(player, ground);
  game.physics.arcade.collide(player, platforms);
  game.physics.arcade.collide(enemies, ground);
  game.physics.arcade.collide(enemies, platforms);
  game.physics.arcade.collide(enemiez, ground);
  game.physics.arcade.collide(enemiez, platforms);
  game.physics.arcade.overlap(player, enemies, enemyHit, null, this);
  game.physics.arcade.overlap(player, enemiez, enemy2Hit, null, this);
  movePlayer();

  enemies.forEachAlive(moveEnemies, this);
  enemiez.forEachAlive(moveEnemies, this);
}

function movePlayer(){
  if(player.x > 800){
    player.x = 16;
  }else if(player.x < 0){
    player.x = 784;
  }
  player.body.velocity.x = 0;
  if(cursors.left.isDown){
    player.body.velocity.x = -150;
    if(jumpButton.isDown && player.body.touching.down){
      player.body.velocity.y = -550;
    }
  }else if(cursors.right.isDown){
    player.body.velocity.x = 150;
    if(jumpButton.isDown && player.body.touching.down){
      player.body.velocity.y = -550;
    }
  }else if(jumpButton.isDown && player.body.touching.down){
    player.body.velocity.y = -550;
  }
}
function moveEnemies(enemy){
  if(enemy.x > 800){
    enemy.x = 16;
  }else if(enemy.x < 0){
    enemy.x = 784;
  }
  if(player.body.velocity.x < 0){
    enemy.body.velocity.x = -115;
  }else if(player.body.velocity.x > 0){
    enemy.body.velocity.x = 115;
  }
}

function enemyHit(player, enemy){
  var x = enemy.x + 80;
  var y = enemy.y;
  enemy.kill();
  score += 20;
  emitter.x = enemy.x;
  emitter.y = enemy.y;
  emitter.start(true, 600, null, 15);
  var z = enemiez.getFirstDead();
  z.reset(x, y);
  z.body.gravity.y = 900;
}
function enemy2Hit(player, enemy){
  enemy.kill();
  score += 40;
  emitter.x = enemy.x;
  emitter.y = enemy.y;
  emitter.start(true, 600, null, 15);
}


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
