var cursors;
var emitter;
var enemies;
var enemiez;
var gameMaleState = {preload: preload, create: create, update: update, render: render};
var hit;
var jumpButton;
var jump;
var jump2;
var platforms;
var player;
var countDown = 30;
var loop = null;
var score = 0;
var timer;
var positions  = [{x:0, y:410, sx:4, sy:1}, {x:480, y:410, sx:4, sy:1}, {x:0, y:275, sx:7, sy:1}, {x:80, y:140, sx:3, sy:4}, {x:640, y:140, sx:3, sy:4},
                  {x:380, y:90, sx:2, sy:4}];
var positions2 = [{x:20, y:380}, {x: 500, y:380}, {x:20, y:450}, {x:200, y:450}, {x:700, y:450}, {x:20, y:220}, {x:150, y:220}, {x:200, y:110},
                  {x:500, y:60}, {x:700, y:100}];


function preload(){
  game.load.image('hole', 'hole-blood.png');
  game.load.audio('jump', 'Jump2.wav')
  game.load.audio('hit', 'Hit_Hurt12.wav')
  game.load.audio('jump2', 'jump3.wav')
  game.stage.backgroundColor = '#01def8'
  game.load.spritesheet('maleHero', 'assets/mains/guyHero.png', 64, 64, 265);
  game.load.spritesheet('uglyGirl', 'assets/variants/fugly_female.png', 64, 64, 265);
  game.load.spritesheet('hotGuy', 'assets/variants/hot_female.png', 64, 64, 265);
}

function create(){
  hit = game.add.audio('hit');
  jump = game.add.audio('jump');
  jump2 = game.add.audio('jump2');

  game.physics.startSystem(Phaser.Physics.ARCADE);
  player = game.add.sprite(game.world.centerX, game.world.centerY, 'maleHero');
  player.animations.add('left', [117, 118, 119, 120, 121, 122, 123, 124, 125], 10, true);
  player.animations.add('right', [143, 144, 145, 146, 147, 148, 149, 150, 151], 10, true);
  player.animations.add('still', [130, 131, 132, 133, 134, 135, 136, 137, 138], 10, true);
  game.physics.enable(player, Phaser.Physics.ARCADE);
  player.anchor.set(0.5, 0.5);
  player.body.gravity.y = 900;
  player.body.setSize(32, 50, 0, 5);

  var platformbmd = game.add.bitmapData(80, 16);
  platformbmd.ctx.rect(0, 0, 80, 16);
  platformbmd.ctx.fillStyle = "#db12ff";
  platformbmd.ctx.fill();

  platforms = game.add.group();
  platforms.enableBody = true;
  platforms.physicsBodyType = Phaser.Physics.ARCADE;
  platforms.createMultiple(6, platformbmd);
  positions.forEach(function(p){
    platform = platforms.getFirstDead();
    platform.reset(p.x, p.y);
    platform.body.immovable = true;
    platform.scale.setTo(p.sx, p.sy)
  }, this);
  ground = platforms.create(0, game.world.height - 64, platformbmd);
  ground.scale.setTo(12, 4);
  ground.body.immovable = true;
  enemies = game.add.group();
  enemies.enableBody = true;
  enemies.physicsBodyType = Phaser.Physics.ARCADE;
  positions2.forEach(function(p){
    var enemy = enemies.create(p.x, p.y, 'uglyGirl');
    enemy.anchor.setTo(0.5, 0.5);
    enemy.body.gravity.y = 900;
    enemy.body.setSize(32, 50, 0, 5);
    enemy.animations.add('left', [117, 118, 119, 120, 121, 122, 123, 124, 125], 10, true);
    enemy.animations.add('right', [143, 144, 145, 146, 147, 148, 149, 150, 151], 10, true);
  }, this);
  enemiez = game.add.group();
  enemiez.enableBody = true;
  enemiez.physicsBodyType = Phaser.Physics.ARCADE;
  emitter = game.add.emitter(0, 0, 15);
  emitter.makeParticles('hole');
  emitter.setYSpeed(-150, 150);
  emitter.setXSpeed(-150, 150);
  emitter.gravity = 0;

  cursors = game.input.keyboard.createCursorKeys();
  jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

  game.time.events.loop(1000, function(){
    enemies.forEachAlive(function(e){
      e.body.velocity.x = 115 * Phaser.Math.randomSign();
      if(e.body.velocity.x < 0){
        e.animations.play('left');
      }else{
        e.animations.play('right');
      }
    }, this);
  }, this);
  game.time.events.loop(1000, function(){
    enemiez.forEachAlive(function(e){
      e.body.velocity.x = 115 * Phaser.Math.randomSign();
      if(e.body.velocity.x < 0){
        e.animations.play('left');
      }else{
        e.animations.play('right');
      }
    }, this);
  }, this);
  game.time.events.loop(1500, function(){
    enemiez.forEachAlive(function(e){
      e.body.velocity.y = 655 * Phaser.Math.randomSign();
      if(e.body.velocity.y<0){
        jump2.play();
      }
    }, this);
  }, this);


  timer = game.add.text(0,0, 'Time: ' + countDown + ' Score: ' + score, {font: '40px Arial', fill:'#ffffff'});
  console.log(timer);
  game.time.events.loop(Phaser.Timer.MINUTE/60, updateCounter);

//  scoreText = game.add.text(700,0, '0', {font: '40px Arial', fill:'#ffffff'});


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


  //updateTimer();
  //updateScore();
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
    player.animations.play('left');
    if(jumpButton.isDown && player.body.touching.down){
      jump.play();
      player.body.velocity.y = -550;
    }
  }else if(cursors.right.isDown){
    player.body.velocity.x = 150;
    player.animations.play('right');
    if(jumpButton.isDown && player.body.touching.down){
      jump.play();
      player.body.velocity.y = -550;
    }
  }else if(jumpButton.isDown && player.body.touching.down){
    jump.play();
    player.body.velocity.y = -550;
  }else{
    player.animations.play('still');
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
    enemy.animations.play('left');
  }else if(player.body.velocity.x > 0){
    enemy.body.velocity.x = 115;
    enemy.animations.play('right');
  }
}

function enemyHit(player, enemy){
  hit.play();
  var x = enemy.x + 80;
  var y = enemy.y;
  enemy.kill();
  score += 20;
  emitter.x = enemy.x;
  emitter.y = enemy.y;
  emitter.start(true, 600, null, 15);
  var z = enemiez.create(x, y, 'hotGuy');
  z.anchor.setTo(0.5, 0.5);
  z.body.gravity.y = 900;
  z.body.setSize(32, 50, 0, 5);
  z.animations.add('left', [117, 118, 119, 120, 121, 122, 123, 124, 125], 10, true);
  z.animations.add('right', [143, 144, 145, 146, 147, 148, 149, 150, 151], 10, true);
}
function enemy2Hit(player, enemy){
  hit.play();
  enemy.kill();
  score += 40;
  emitter.x = enemy.x;
  emitter.y = enemy.y;
  emitter.start(true, 600, null, 15);
}

function updateCounter() {
  if(countDown === 1){
    timer.setText('Time\'s up!');
    gameOver();
  } else {
    countDown--;
    timer.setText('Time: ' + countDown + ' Score: ' + score);
  }
}

function gameOver() {
  game.state.start('gameOver');
  yeah.stop();
}
function render(){
  //game.debug.body(player);
}
//function updateScore(){
  //scoreText.setText(score);
//}
